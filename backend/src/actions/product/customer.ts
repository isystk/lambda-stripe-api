import { Request, Response } from 'express'
import { STRIPE_SECRET } from '../../constants'
import stripe from 'stripe'

// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)

type Customer = {
  id: string
  email: string
  name: string
  subscriptions: Subscription[]
}

type Subscription = {
  id: string
  current_period_start: number
  current_period_end: number
  plan: {
    planId: string
    product: string
    interval: 'month' | 'year'
    amount: number
  }
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

    // 商品IDに紐づくにサブスクリプションを検索する
    const { data: c }: { data: Customer[] } =
      await stripeInstance.customers.list()

    const customers = await Promise.all(
      c.map(async ({ id, email, name }) => {
        const { data: s }: { data: Subscription[] } =
          await stripeInstance.subscriptions.list({
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
}

export { customer }
