import { Request, Response } from 'express'
import { Post, Status, STRIPE_SECRET } from '../../constants'
import { DynamoDBClient } from '../../utils/dynamodb-client'
const dbClient = new DynamoDBClient('stripe_subscription_api_posts')
import stripe from 'stripe'

import { SmtpClient } from '../../utils/smtp-client'
const mailClient = new SmtpClient()
// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)

// 解約処理（サブスクリプションを解約します）
const cancel = async (req: Request, res: Response) => {
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

    // メールアドレスを元にサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: post.customer_id,
      status: 'active',
    })

    if (0 === subscriptions.length) {
      throw new Error('No valid Subscription found.')
    }
    for (const subscription of subscriptions) {
      // // サブスクリプションをキャンセルする
      // await stripeInstance.subscriptions.del(subscription.id)
      // 期間満了となったら解約させる
      await stripeInstance.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      })
    }

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
    const text = [
      `${customer.name}様`,
      '解約手続きが完了しましたのでご案内申し上げます。',
      '期間満了までは引き続きご利用頂けます。',
      'またのご利用をお待ちしております。',
    ].join('\n\n')

    // メールを送信します。
    await mailClient.mailSend(
      undefined,
      customer.email,
      '解約手続き完了のお知らせ',
      text
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

export { cancel }
