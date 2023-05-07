import express, { Application, Request, Response } from 'express'
import { DynamoDBClient, DynamoDBRecord } from './dynamodb-client.js'
const dbClient = new DynamoDBClient('lambda_stripe_api_posts')
import uuid from 'node-uuid'
import cors from 'cors'
import crypto from 'crypto'
import stripe from 'stripe'
import { isString } from 'lodash'
import { SmtpClient } from './smtp-client'
const mailClient = new SmtpClient()
// @ts-ignore
const stripeInstance = stripe(process.env.STRIPE_SECRET ?? '')

const ENDPOINT_URL = process.env.ENDPOINT_URL ?? ''

const app: Application = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const Status = {
  untreated: 0, // 処理待ち
  contract: 1, // 契約中
  cancelled: 9, // 解約済み
} as const

type Post = {
  status: (typeof Status)[keyof typeof Status]
  cancel_token: string | undefined
  cancel_token_at: string | undefined
} & DynamoDBRecord

// 商品と含まれるプランの一覧を取得します。
app.get('/product', async (req: Request, res: Response) => {
  const { productId } = {
    productId: req.query['productId'],
  }
  try {
    if (productId !== undefined && !isString(productId)) {
      throw new Error('ProductId is invalid.')
    }
    // 商品の一覧
    let { data: products } = await stripeInstance.products.list()
    if (productId) {
      products = products.filter((e: { id: string }) => {
        return e.id === productId
      })
    }
    const { data: allPlan } = await stripeInstance.plans.list()
    products = products.map((e: { id: string }) => {
      const plans = allPlan.filter(
        (e2: { product: string }) => e2.product === e.id
      )
      return { ...e, plans }
    })

    res.json(products)
  } catch (e: unknown) {
    console.error('error', e)
    let message
    if (e instanceof Error) {
      message = e.message
    }
    res.status(500).json({ message })
  }
})

// 支払い処理（サブスクリプションを作成します）
app.post('/payment', async (req: Request, res: Response) => {
  const { paymentMethod, name, email, planId } = {
    paymentMethod: req.body['paymentMethod'],
    name: req.body['name'],
    email: req.body['email'],
    planId: req.body['planId'],
  }
  try {
    if (paymentMethod === undefined) {
      throw new Error('paymentMethod is required.')
    }
    if (name === undefined) {
      throw new Error('name is required.')
    }
    if (email === undefined) {
      throw new Error('email is required.')
    }
    if (planId === undefined) {
      throw new Error('planId is required.')
    }

    // メールアドレスを元に顧客を取得する
    const { data: customers } = await stripeInstance.customers.list({
      email,
    })
    let customer
    if (0 === customers.length) {
      // 顧客を作成する
      customer = await stripeInstance.customers.create({
        email,
        payment_method: paymentMethod,
        invoice_settings: {
          default_payment_method: paymentMethod, // 顧客のデフォルトの支払い方法
        },
      })
      console.log('Create Customer:', customer)
    } else {
      customer = customers[0]
      console.log('Found Customer:', customer)
    }

    const postId = crypto.createHash('sha256').update(customer.id).digest('hex')
    let post = await getPost(postId)
    if (!post) {
      // 顧客をDBに登録する
      const params = {
        pk: postId,
        sk: customer.id,
        status: Status.untreated,
      } as Post
      post = await dbClient.create<Post>(params)
      console.log('Regist Post:', post.pk, post.sk)
    }

    // 商品に紐つくプランを全て検索し、該当するプランを返却する
    const plan = await stripeInstance.plans.retrieve(planId)
    // console.log('Found Plan:', plan)
    if (!plan) {
      throw new Error('Plan not found.')
    }

    // メールアドレスを元にサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: customer.id,
      plan: plan.id,
      status: 'active', // サブスクリプションの状態を指定する。active, canceled, or all.
    })

    if (0 < subscriptions.length) {
      throw new Error('A valid subscription already exists for this Plan')
    }
    // サブスクリプションを作成する
    const subscription = await stripeInstance.subscriptions.create({
      customer: customer.id, // 顧客ID
      items: [{ plan: plan.id }], // プランID
    })
    console.log('Create Subscription:', subscription)

    // 顧客のステータスを「契約中」にする
    post = await dbClient.update<Post>(
      {
        pk: postId,
        sk: customer.id,
      },
      {
        status: Status.contract,
      } as Post
    )
    console.log('Update Post:', post.pk, post.sk, post.status)

    const text = [
      `${name}様`,
      'この度は、lambda-stripe-apiをご利用いただき、誠にありがとうございます。',
      '会員登録が完了しました。',
      '',
      '登録内容について',
      '----',
      '',
      '----',
    ].join('\\n')

    // メールを送信します。
    await mailClient.mailSend(
      undefined,
      email,
      'ご登録ありがとうございます',
      text
    )

    res.json({
      message: 'Successfully created a Subscription!',
    })
  } catch (e: unknown) {
    console.error('error', e)
    let message
    if (e instanceof Error) {
      message = e.message
    }
    res.status(500).json({ message })
  }
})

// 解約リクエスト（解約ページのURLをメールで送信します）
app.post('/cancel-request', async (req: Request, res: Response) => {
  const { productId, email } = {
    productId: req.body['productId'],
    email: req.body['email'],
  }
  try {
    if (productId === undefined) {
      throw new Error('productId is required.')
    }
    if (email === undefined) {
      throw new Error('email is required.')
    }

    // 商品を取得する
    const product = await stripeInstance.products.retrieve(productId)
    if (!product) {
      throw new Error('No Product Found for productId.')
    }
    const { data: allPlan } = await stripeInstance.plans.list()
    const plans = allPlan.filter(
      (e: { product: string }) => e.product === product.id
    )
    if (0 === plans.length) {
      throw new Error('No Plan Found for productId.')
    }

    // メールアドレスを元にCustomerを検索する
    const { data: customers } = await stripeInstance.customers.list({
      email,
    })
    if (0 === customers.length) {
      throw new Error('No Customer Found for Email.')
    }
    const customer = customers[0]

    // 顧客が契約中のサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: customer.id,
      status: 'active',
    })
    console.log('subscriptions', subscriptions)

    if (0 === subscriptions.length) {
      throw new Error('No valid Subscription found.')
    }

    // 解約ページのトークンを生成する
    const postId = crypto.createHash('sha256').update(customer.id).digest('hex')
    let post = await getPost(postId)
    const params = {
      ...post,
      pk: postId,
      sk: customer.id,
      status: Status.contract,
      cancel_token: uuid.v4(),
      cancel_token_at: new Date().toISOString(),
    } as Post
    // stripeに存在してDynamoDBに存在しない顧客（通常はありえないが）を想定して、updateではなくcreateにしておく
    post = await dbClient.create<Post>(params)

    const cancelUrl = `${ENDPOINT_URL}/products/${productId}/cancel/${post.cancel_token}`
    // 解約ページのURLをメールで送信する
    const text = [
      'いつもご利用頂きありがとうございます。',
      'お手数ですが以下のURLからご契約のプランの解約手続きをお願い致します。',
      '',
      cancelUrl,
    ].join('\\n')

    // メールを送信します。
    await mailClient.mailSend(
      undefined,
      email,
      '解約ページのURLをお送りします。',
      text
    )

    res.json({
      message:
        'The URL of the cancellation page was successfully sent via email!',
    })
  } catch (e: unknown) {
    console.error('error', e)
    let message
    if (e instanceof Error) {
      message = e.message
    }
    res.status(500).json({ message })
  }
})

// 解約リクエスト確認（解約ページの情報を取得します）
app.post('/cancel-confirm', async (req: Request, res: Response) => {
  const { productId, cancelToken } = {
    productId: req.body['productId'],
    cancelToken: req.body['cancelToken'],
  }
  try {
    if (productId === undefined) {
      throw new Error('productId is required.')
    }
    if (cancelToken === undefined) {
      throw new Error('cancelToken is required.')
    }

    const posts = await dbClient
      .scan<Post>('cancel_token = :cancel_token', undefined, {
        ':cancel_token': cancelToken,
      })
      .then((e) =>
        e.sort(function (a, b) {
          // 登録日時の降順
          return a.created_at > b.created_at ? -1 : 1
        })
      )
    if (0 === posts.length) {
      throw new Error('cancelToken not found.')
    }
    const post = posts[0]
    if (!post?.cancel_token_at) {
      throw new Error('An unexpected error has occurred.')
    }
    const sessionTime = 60 * 60 * 1000 // １時間
    const hourAgo = new Date(new Date().getTime() - sessionTime).getTime()
    if (hourAgo > new Date(post.cancel_token_at).getTime()) {
      // トークン発行から１時間経過した場合はエラーにする
      throw new Error(
        'The deadline has passed. Please submit a cancellation request again.'
      )
    }
    const customerId = post?.sk
    // 顧客IDに紐づくにサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: customerId,
      status: 'active',
    })
    console.log('subscriptions', subscriptions)

    res.json(subscriptions)
  } catch (e: unknown) {
    console.error('error', e)
    let message
    if (e instanceof Error) {
      message = e.message
    }
    res.status(500).json({ message })
  }
})

// キャンセル処理（サブスクリプションを解約します）
app.post('/cancel', async (req: Request, res: Response) => {
  const { productId, cancelToken } = {
    productId: req.body['productId'],
    cancelToken: req.body['cancelToken'],
  }
  try {
    if (productId === undefined) {
      throw new Error('productId is required.')
    }
    if (cancelToken === undefined) {
      throw new Error('cancelToken is required.')
    }

    const posts = await dbClient
      .scan<Post>('cancel_token = :cancel_token', undefined, {
        ':cancel_token': cancelToken,
      })
      .then((e) =>
        e.sort(function (a, b) {
          // 登録日時の降順
          return a.created_at > b.created_at ? -1 : 1
        })
      )
    if (0 === posts.length) {
      throw new Error('cancelToken not found.')
    }
    let post = posts[0]
    if (!post || !post?.cancel_token_at) {
      throw new Error('An unexpected error has occurred.')
    }
    const customerId = post.sk

    // メールアドレスを元にサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: customerId,
      status: 'active',
    })

    if (0 === subscriptions.length) {
      throw new Error('No valid Subscription found.')
    }
    for (const subscription of subscriptions) {
      // サブスクリプションをキャンセルする
      await stripeInstance.subscriptions.del(subscription.id)
    }

    // 顧客のステータスを「解約済み」にする
    post = await dbClient.update<Post>(
      {
        pk: post.pk,
        sk: post.sk,
      },
      {
        status: Status.cancelled,
      } as Post
    )
    console.log('Update Post:', post.pk, post.sk, post.status)

    res.json({ message: 'Successfully removed a Subscription!' })
  } catch (e: unknown) {
    console.error('error', e)
    let message
    if (e instanceof Error) {
      message = e.message
    }
    res.status(500).json({ message })
  }
})

// アクティブチェック（サブスクリプションが有効かどうかを確認します）
app.post('/active-check', async (req: Request, res: Response) => {
  const { email, planId } = {
    email: req.body['email'],
    planId: req.body['planId'],
  }

  try {
    if (email === undefined) {
      throw new Error('email is required.')
    }
    if (planId === undefined) {
      throw new Error('planId is required.')
    }

    // メールアドレスを元にCustomerを検索する
    const { data: customers } = await stripeInstance.customers.list({
      email,
    })
    if (0 === customers.length) {
      throw new Error('No customers found for Email.')
    }
    const customer = customers[0]

    // 顧客IDに紐づくにサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: customer.id,
      plan: planId,
      status: 'all',
    })

    // 最新のサブスクリプションがactiveであれば、課金中と判定する
    const status =
      subscriptions.length > 0 && subscriptions[0].status === 'active'
    res.json({ status })
  } catch (e: unknown) {
    console.error('error', e)
    let message
    if (e instanceof Error) {
      message = e.message
    }
    res.status(500).json({ message })
  }
})

// 404エラーハンドリング
app.use((_req, res, _next) => {
  res.status(404).send('404 Not Found').end()
})

const getPost = async (pk: string): Promise<Post | undefined> => {
  const post = await dbClient.query<Post>('pk = :pk', undefined, undefined, {
    ':pk': pk,
  })
  if (0 === post.length) {
    return undefined
  }
  return post[0]
}

export { app }
