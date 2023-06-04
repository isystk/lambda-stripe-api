import { Request, Response } from 'express'
import { Post, Status, STRIPE_SECRET } from '../../constants'
import { DynamoDBClient } from '../../utils/dynamodb-client'
const dbClient = new DynamoDBClient('stripe_subscription_api_posts')
import crypto from 'crypto'
import stripe from 'stripe'

import { SmtpClient } from '../../utils/smtp-client'
import { Mails } from '../../mails'
const mailClient = new SmtpClient()
// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)

// 契約処理（サブスクリプションを作成します）
const payment = async (req: Request, res: Response) => {
  const { userKey, paymentMethod, name, email, planId } = {
    userKey: req.body['userKey'] ?? req.body['email'], // ユーザーキーが未指定の場合はメールアドレスをユーザーキーとする
    paymentMethod: req.body['paymentMethod'],
    name: req.body['name'],
    email: req.body['email'],
    planId: req.body['planId'],
  }
  const acceptLanguage: string | undefined = req.headers['accept-language'] as
    | string
    | undefined
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
    const productId = plan.product

    const postId = crypto.createHash('sha256').update(userKey).digest('hex')
    let post = await getPostById(postId, productId)
    if (!post) {
      // 顧客が未登録の場合は新規登録する
      const params = {
        pk: postId,
        sk: productId,
        customer_id: customer.id,
        status: Status.untreated,
      } as Post
      post = await dbClient.create<Post>(params)
      console.log('Regist Post:', post.pk, post.sk)
    }

    // メールアドレスを元にサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: customer.id,
      status: 'active', // サブスクリプションの状態を指定する。active, canceled, or all.
    })
    const s = subscriptions.filter(
      (e: { plan: { product: string } }) => e.plan.product === productId
    )
    if (0 < s.length) {
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

    // メールを送信します。
    await mailClient.sendToUser(
      email,
      Mails.PAYMENT,
      { name, currentPeriodEnd },
      acceptLanguage
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
}

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

export { payment }
