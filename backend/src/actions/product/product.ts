import { Request, Response } from 'express'
import { STRIPE_SECRET } from '../../constants'
import stripe from 'stripe'
import { isString } from 'lodash'
// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)

// 商品と含まれるプランの一覧を取得します。
const product = async (req: Request, res: Response) => {
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
        (e2: { product: string; active: boolean }) =>
          e2.product === e.id && e2.active === true
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
}

export { product }
