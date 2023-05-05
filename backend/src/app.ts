// import { DynamoDBClient, type DynamoDBRecord } from './dynamodb-client.js'
// const dbClient = new DynamoDBClient('lambda_stripe_api_posts')
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
// import crypto from 'crypto'
import stripe from 'stripe'
import { isString } from 'lodash'
// @ts-ignore
const stripeInstance = stripe(process.env.STRIPE_SECRET ?? '')

const app: Application = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// type Post = {
//   paymentMethod: string
//   name: string
//   email: string
//   priceId: string
// } & DynamoDBRecord

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
    const { data: plans } = await stripeInstance.plans.list()
    products = products.map((e: { id: string }) => {
      const plan = plans.filter(
        (e2: { product: string }) => e2.product === e.id
      )
      return { ...e, plan }
    })
    res.json(products)
  } catch (e: unknown) {
    console.error('error', e)
    res.sendStatus(500)
  }
})

// 支払い処理（サブスクリプションを作成します）
app.post('/payment', async (req: Request, res: Response) => {
  const { paymentMethod, name, email, productId } = {
    paymentMethod: req.body['paymentMethod'],
    name: req.body['name'],
    email: req.body['email'],
    productId: req.body['productId'],
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
    if (productId === undefined) {
      throw new Error('productId is required.')
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

    // 商品の情報を取得します。
    const product = await stripeInstance.products.retrieve(productId)
    // console.log("Product Info:", product);
    if (!product) {
      throw new Error('Product not found.')
    }

    // 商品に紐つくプランを全て検索し、該当するプランを返却する
    const { data: plans } = await stripeInstance.plans.list()
    const plan = plans.find((e: { product: any }) => e.product === product.id)
    // console.log('Found Plan:', plan)
    if (!plan) {
      throw new Error('Plan not found.')
    }

    // メールアドレスを元にサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer_email: email,
      plan: [plan.id],
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

    // サブスクリプションをキャンセルする
    // await stripeInstance.subscriptions.del("sub_1N4HnnGvN4v1v54fzwpv0euk");

    // const pk = crypto
    //     .createHash('sha256')
    //     .update(email)
    //     .digest('hex')
    // const params = {
    //   pk,
    //   sk: 'line',
    //   paymentMethod,
    //   name,
    //   email,
    //   priceId,
    // } as Post
    // const post = await dbClient.post<Post>(params)
    res.json({ message: 'Successfully created a Subscription!' })
  } catch (e: unknown) {
    console.error('error', e)
    res.sendStatus(500)
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
    res.sendStatus(500)
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
    res.sendStatus(500)
  }
})

export { app }
