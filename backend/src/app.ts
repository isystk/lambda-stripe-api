import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import stripe from 'stripe'
import { isString } from 'lodash'
import { SmtpClient } from './smtp-client'
const mailClient = new SmtpClient()
// @ts-ignore
const stripeInstance = stripe(process.env.STRIPE_SECRET ?? '')

const app: Application = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

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

// キャンセル処理（サブスクリプションを解約します）
app.post('/cancel', async (req: Request, res: Response) => {
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

    // メールアドレスを元にサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: customer.id,
      plan: planId,
      status: 'active',
    })

    if (0 === subscriptions.length) {
      throw new Error('No valid Subscription found.')
    }
    const subscription = subscriptions[0]

    // サブスクリプションをキャンセルする
    await stripeInstance.subscriptions.del(subscription.id)

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

    // メールアドレスを元にサブスクリプションを検索する
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

export { app }
