import { Request, Response } from 'express'
import { STRIPE_SECRET } from '../../constants'
import stripe from 'stripe'

// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)

type Subscription = {
  id: string
  current_period_start: number
  current_period_end: number
  productId: string
}

// 指定した商品の直近１２ヶ月分の契約情報を取得します
const subscriberTrend = async (req: Request, res: Response) => {
  const { productId } = {
    productId: req.body['productId'],
  }

  try {
    if (productId === undefined) {
      throw new Error('productId is required.')
    }

    const { data: s }: {data: Array<{
        id: string,
        current_period_start: number,
        current_period_end: number,
        plan: { product: string },
      }>} = await stripeInstance.subscriptions.list({
      status: 'active',
    })

    const data: Subscription[] = s
      .map(
        ({
          id,
          current_period_start,
          current_period_end,
          plan: { product: productId },
        }) => {
          return { id, current_period_start, current_period_end, productId }
        }
      )
      .filter((e) => e.productId === productId)

    // 今月から１２ヶ月分の月初を取得
    const now = new Date()
    const months = []
    for (let i = 12; i > 0; i--) {
      const current = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const year = current.getFullYear()
      const month = (current.getMonth() + 1).toString().padStart(2, '0')
      const date = '01'
      months.push(`${year}-${month}-${date}`)
    }

    const result = months.map((month) => {
      return {
        month,
        subscriptions: data.filter((s) => {
          const currentMonth = new Date(month).getTime()
          const nextMonth = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 1).getTime();
          return (s.current_period_start*1000) < nextMonth && currentMonth <= (s.current_period_end*1000)
        }),
      }
    })

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

export { subscriberTrend }
