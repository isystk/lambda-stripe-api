import { Request, Response } from 'express'
import { Post, STRIPE_SECRET } from '../../constants'
import { DynamoDBClient } from '../../utils/dynamodb-client'
const dbClient = new DynamoDBClient('stripe_subscription_api_posts')
import crypto from 'crypto'
import stripe from 'stripe'

// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)

// アクティブチェック（サブスクリプションが有効かどうかを確認します）
const activeCheck = async (req: Request, res: Response) => {
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

export { activeCheck }
