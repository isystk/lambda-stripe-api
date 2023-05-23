import express, { Application, Request, Response } from 'express'
import { DynamoDBClient, DynamoDBRecord } from './dynamodb-client.js'
const dbClient = new DynamoDBClient('stripe_subscription_api_posts')
import uuid from 'node-uuid'
import cors from 'cors'
import crypto from 'crypto'
import stripe from 'stripe'
import { isString } from 'lodash'
import session, { checkAuth } from './session'

import { SmtpClient } from './smtp-client'
const mailClient = new SmtpClient()
// @ts-ignore
const stripeInstance = stripe(process.env.STRIPE_SECRET ?? '')

const ORIGIN_URL = process.env.ORIGIN_URL ?? ''

const app: Application = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  cors({
    origin: ORIGIN_URL, //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
)
session(app)

const Status = {
  untreated: 0, // 処理待ち
  contract: 1, // 契約中
  cancelled: 9, // 解約済み
} as const

type Post = {
  customer_id: string
  status: (typeof Status)[keyof typeof Status]
  cancel_token: string | undefined
  cancel_token_at: string | undefined
  cancel_at: string | undefined
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
    let { data: products } = await stripeInstance.products.list({
      type: 'service', // サブスクリプションに限定する
    })
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

// 契約処理（サブスクリプションを作成します）
app.post('/payment', async (req: Request, res: Response) => {
  const { userKey, paymentMethod, name, email, planId } = {
    userKey: req.body['userKey'] ?? req.body['email'], // ユーザーキーが未指定の場合はメールアドレスをユーザーキーとする
    paymentMethod: req.body['paymentMethod'],
    name: req.body['name'],
    email: req.body['email'],
    planId: req.body['planId'],
  }
  try {
    if (userKey === undefined) {
      throw new Error('userKey is required.')
    }
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
        name,
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

    // 商品に紐つくプランを全て検索し、該当するプランを返却する
    const plan = await stripeInstance.plans.retrieve(planId)
    // console.log('Found Plan:', plan)
    if (!plan) {
      throw new Error('Plan not found.')
    }

    const postId = crypto.createHash('sha256').update(userKey).digest('hex')
    let post = await getPostById(postId, plan.product)
    if (!post) {
      // 顧客が未登録の場合は新規登録する
      const params = {
        pk: postId,
        sk: plan.product,
        customer_id: customer.id,
        status: Status.untreated,
      } as Post
      post = await dbClient.create<Post>(params)
      console.log('Regist Post:', post.pk, post.sk)
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
    await dbClient.update<Post>(
      {
        pk: postId,
        sk: plan.product,
      },
      {
        status: Status.contract,
      } as Post
    )

    let currentPeriodEnd = ''
    if (subscription.current_period_end) {
      const date = new Date(subscription.current_period_end * 1000)
      currentPeriodEnd =
        date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    }

    const text = [
      `${name}様`,
      'この度は、ご利用いただき、誠にありがとうございます。',
      '会員登録が完了しました。',
      '----',
      `現在の有効期限： ～${currentPeriodEnd}`,
      '----',
      'お客様の会員資格はキャンセルされるまで毎月自動で更新し、毎月更新日に会費が請求されます。',
    ].join('\n\n')

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
    if (0 === subscriptions.length) {
      throw new Error('No valid Subscription found.')
    }

    // 解約ページのトークンを生成する
    let post = await getPostByCustomerId(productId, customer.id)
    if (!post) {
      throw new Error('No valid Post found.')
    }
    if (post.status === Status.cancelled) {
      throw new Error('Already cancelled.')
    }
    const params = {
      ...post,
      cancel_token: uuid.v4(),
      cancel_token_at: new Date().toISOString(),
    } as Post
    post = await dbClient.update<Post>({ pk: post.pk, sk: post.sk }, params)

    const cancelUrl = `${ORIGIN_URL}/product/${productId}/cancel/${post.cancel_token}`
    // 解約ページのURLをメールで送信する
    const text = [
      `${customer.name}様`,
      'いつもご利用頂きありがとうございます。',
      'お手数ですが以下のURLからご契約のプランの解約手続きをお願い致します。',
      '',
      cancelUrl,
    ].join('\n\n')

    // メールを送信します。
    await mailClient.mailSend(undefined, email, '解約手続きのご案内', text)

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

    const post = await getPostByCancelToken(productId, cancelToken)
    if (!post) {
      throw new Error('cancelToken not found.')
    }
    if (!post || !post?.cancel_token_at) {
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
    // 顧客IDに紐づくにサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: post.customer_id,
      status: 'active',
    })

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

// 解約処理（サブスクリプションを解約します）
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

    const post = await getPostByCancelToken(productId, cancelToken)
    if (!post) {
      throw new Error('cancelToken not found.')
    }
    if (!post || !post?.cancel_token_at) {
      throw new Error('An unexpected error has occurred.')
    }

    // メールアドレスを元にサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: post.customer_id,
      status: 'active',
    })

    if (0 === subscriptions.length) {
      throw new Error('No valid Subscription found.')
    }
    for (const subscription of subscriptions) {
      // // サブスクリプションをキャンセルする
      // await stripeInstance.subscriptions.del(subscription.id)
      // 期間満了となったら解約させる
      await stripeInstance.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      })
    }

    // 顧客のステータスを「解約済み」にする
    await dbClient.update<Post>(
      {
        pk: post.pk,
        sk: post.sk,
      },
      {
        status: Status.cancelled,
        cancel_token: undefined,
        cancel_token_at: undefined,
        cancel_at: new Date().toISOString(),
      } as Post
    )

    const customer = await stripeInstance.customers.retrieve(post.customer_id)

    // 解約完了のメールを送信する
    const text = [
      `${customer.name}様`,
      '解約手続きが完了しましたのでご案内申し上げます。',
      '期間満了までは引き続きご利用頂けます。',
      'またのご利用をお待ちしております。',
    ].join('\n\n')

    // メールを送信します。
    await mailClient.mailSend(
      undefined,
      customer.email,
      '解約手続き完了のお知らせ',
      text
    )

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
  const { productId, userKey } = {
    productId: req.body['productId'],
    userKey: req.body['userKey'],
  }

  try {
    if (productId === undefined) {
      throw new Error('productId is required.')
    }
    if (userKey === undefined) {
      throw new Error('userKey is required.')
    }

    const postId = crypto.createHash('sha256').update(userKey).digest('hex')
    const post = await getPostById(postId, productId)
    if (!post) {
      throw new Error('No valid Post found.')
    }

    const customer = await stripeInstance.customers.retrieve(post.customer_id)
    if (!customer) {
      throw new Error('No customer found for id.')
    }

    const { data: allPlan } = await stripeInstance.plans.list()
    const plans = allPlan.filter(
      (e2: { product: string }) => e2.product === productId
    )
    if (0 === plans.length) {
      throw new Error('No plans found for productId.')
    }

    const result = {
      status: false,
      current_period_start: '',
      current_period_end: '',
    }
    for (const plan of plans) {
      if (result.status) {
        // １つでもActiveなプランがあれば処理を抜ける
        break
      }
      // 顧客IDに紐づくにサブスクリプションを検索する
      const { data: subscriptions } = await stripeInstance.subscriptions.list({
        customer: customer.id,
        plan: plan.id,
        status: 'all',
      })
      if (0 < subscriptions.length) {
        const subscription = subscriptions[0]
        // 最新のサブスクリプションがactiveであれば、課金中と判定する
        const status = subscription.status === 'active'
        result['current_period_start'] = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000).toISOString()
          : ''
        result['current_period_end'] = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : ''
        result['status'] =
          status &&
          subscription.current_period_end * 1000 >= new Date().getTime() &&
          subscription.current_period_start * 1000 <= new Date().getTime()
      }
    }

    res.json(result)
  } catch (e: unknown) {
    console.error('error', e)
    let message
    if (e instanceof Error) {
      message = e.message
    }
    res.status(500).json({ message })
  }
})

// 指定した商品のすべての顧客情報を取得します。
app.post('/customer', checkAuth, async (req: Request, res: Response) => {
  const { productId } = {
    productId: req.body['productId'],
  }

  try {
    if (productId === undefined) {
      throw new Error('productId is required.')
    }

    // 商品IDに紐づくにサブスクリプションを検索する
    const { data: c } = await stripeInstance.customers.list()

    const customers = await Promise.all(
      c.map(async ({ id, email, name }) => {
        const { data: s } = await stripeInstance.subscriptions.list({
          customer: id,
          status: 'active',
        })
        const subscriptions = s.map(
          ({
            id,
            current_period_start,
            current_period_end,
            plan: { planId, product, interval, amount },
          }) => {
            const plan = { planId, product, interval, amount }
            return { id, current_period_start, current_period_end, plan }
          }
        )
        return { id, email, name, subscriptions }
      })
    )

    const result = []
    for (const c of customers) {
      for (const s of c.subscriptions) {
        if (s.plan.product === productId) {
          result.push(c)
          break
        }
      }
    }

    res.json(result)
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
app.use((_req, res) => {
  res.status(404).send('404 Not Found').end()
})

const getPostById = async (
  userKey: string,
  productId: string
): Promise<Post | undefined> => {
  const post = await dbClient.query<Post>(
    'pk = :pk and sk = :sk',
    undefined,
    undefined,
    {
      ':pk': userKey,
      ':sk': productId,
    }
  )
  if (0 === post.length) {
    return undefined
  }
  return post[0]
}
const getPostByCustomerId = async (
  productId: string,
  customerId: string
): Promise<Post | undefined> => {
  const post = await dbClient.scan<Post>(
    'sk = :sk and customer_id = :customer_id',
    undefined,
    {
      ':sk': productId,
      ':customer_id': customerId,
    }
  )
  if (0 === post.length) {
    return undefined
  }
  return post[0]
}
const getPostByCancelToken = async (
  productId: string,
  cancelToken: string
): Promise<Post | undefined> => {
  const post = await dbClient.scan<Post>(
    'sk = :sk and cancel_token = :cancel_token',
    undefined,
    {
      ':sk': productId,
      ':cancel_token': cancelToken,
    }
  )
  if (0 === post.length) {
    return undefined
  }
  return post[0]
}

export { app }
