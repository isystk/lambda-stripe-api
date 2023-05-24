import { Request, Response } from 'express'
import { Post, STRIPE_SECRET } from '../../constants'
import { DynamoDBClient } from '../../utils/dynamodb-client'
const dbClient = new DynamoDBClient('stripe_subscription_api_posts')
import stripe from 'stripe'

// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)

// 解約リクエスト確認（解約ページの情報を取得します）
const cancelConfirm = async (req: Request, res: Response) => {
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

export { cancelConfirm }
