import { Request, Response } from 'express'
import { STRIPE_SECRET } from '../../constants'
import stripe from 'stripe'
import * as _ from 'lodash'

// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)


type Subscription = {
  id: string
  current_period_start: number
  current_period_end: number
  planId: string
  productId: string
  productName: string
  customerId: string
  customerName: string
  email: string
  interval: "month"|"year"
  currency: string
  amount: number 
}

// 指定した商品のすべての顧客情報を取得します。
const customer = async (req: Request, res: Response) => {
  const { productId } = {
    productId: req.body['productId'],
  }

  try {
    if (productId === undefined) {
      throw new Error('productId is required.')
    }

    const { data: products } = await stripeInstance.products.list({
      type: 'service', // サブスクリプションに限定する
    })
    const productMap = _.mapKeys(products, "id")
    const { data: customers }: { data: Customer[] } =
      await stripeInstance.customers.list()
    const customerMap = _.mapKeys(customers, "id")
    
    const { data: s } =
        await stripeInstance.subscriptions.list()

    const data: Subscription[] = s.map(({
            id,
            current_period_start,
            current_period_end,
            status,
            cancel_at,
            customer: customerId,
            plan: { planId, product: productId, interval, currency, amount },
      }) => {
        const {name: productName} = productMap[productId];
        const {name: customerName, email} = customerMap[customerId];
        return { id, current_period_start, current_period_end, status, cancel_at, planId, productId, productName, customerId, customerName, email, interval, currency, amount }
      })

    const result = []
    for (const d of data) {
      if (d.productId === productId) {
        result.push(d)
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
}

export { customer }
