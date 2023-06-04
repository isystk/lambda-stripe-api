import { Request, Response } from 'express'
import { Post, Status, STRIPE_SECRET } from '../../constants'
import { DynamoDBClient } from '../../utils/dynamodb-client'
const dbClient = new DynamoDBClient('stripe_subscription_api_posts')
import stripe from 'stripe'

import { SmtpClient } from '../../utils/smtp-client'
import { Mails } from '../../mails'
const mailClient = new SmtpClient()

// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)

// 解約処理（サブスクリプションを解約します）
const adminCancel = async (req: Request, res: Response) => {
  const { subscriptionId } = {
    subscriptionId: req.body['subscriptionId'],
  }
  const acceptLanguage: string | undefined = req.headers['accept-language'] as
    | string
    | undefined
  try {
    if (subscriptionId === undefined) {
      throw new Error('subscriptionId is required.')
    }

    // サブスクリプションを検索する
    const subscription = await stripeInstance.subscriptions.retrieve(
      subscriptionId
    )
    if (!subscription) {
      throw new Error('No valid Subscription found.')
    }
    const {
      plan: { product: productId },
    } = subscription

    const post = await getPostByProductId(productId)
    if (!post) {
      throw new Error('cancelToken not found.')
    }

    console.log('subscriptionId', subscriptionId)
    // サブスクリプションをキャンセルする
    await stripeInstance.subscriptions.del(subscriptionId)
    // // 期間満了となったら解約させる
    // await stripeInstance.subscriptions.update(subscriptionId, {
    //   cancel_at_period_end: true,
    // })

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
    await mailClient.sendToUser(
      customer.email,
      Mails.MIDTERM_CANCEL,
      { name: customer.name },
      acceptLanguage
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
}

const getPostByProductId = async (
  productId: string
): Promise<Post | undefined> => {
  const post = await dbClient.scan<Post>('sk = :sk', undefined, {
    ':sk': productId,
  })
  if (0 === post.length) {
    return undefined
  }
  return post[0]
}

export { adminCancel }
