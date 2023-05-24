import { Request, Response } from 'express'
import { ORIGIN_URL, Post, Status, STRIPE_SECRET } from '../../constants'
import { DynamoDBClient } from '../../utils/dynamodb-client'
const dbClient = new DynamoDBClient('stripe_subscription_api_posts')
import uuid from 'node-uuid'
import stripe from 'stripe'

import { SmtpClient } from '../../utils/smtp-client'
const mailClient = new SmtpClient()
// @ts-ignore
const stripeInstance = stripe(STRIPE_SECRET)

// 解約リクエスト（解約ページのURLをメールで送信します）
const cancelRequest = async (req: Request, res: Response) => {
  const { productId, email } = {
    productId: req.body['productId'],
    email: req.body['email'],
  }
  try {
    if (productId === undefined) {
      throw new Error('productId is required.')
    }
    if (email === undefined) {
      throw new Error('email is required.')
    }

    // 商品を取得する
    const product = await stripeInstance.products.retrieve(productId)
    if (!product) {
      throw new Error('No Product Found for productId.')
    }
    const { data: allPlan } = await stripeInstance.plans.list()
    const plans = allPlan.filter(
      (e: { product: string }) => e.product === product.id
    )
    if (0 === plans.length) {
      throw new Error('No Plan Found for productId.')
    }

    // メールアドレスを元にCustomerを検索する
    const { data: customers } = await stripeInstance.customers.list({
      email,
    })
    if (0 === customers.length) {
      throw new Error('No Customer Found for Email.')
    }
    const customer = customers[0]

    // 顧客が契約中のサブスクリプションを検索する
    const { data: subscriptions } = await stripeInstance.subscriptions.list({
      customer: customer.id,
      status: 'active',
    })
    if (0 === subscriptions.length) {
      throw new Error('No valid Subscription found.')
    }

    // 解約ページのトークンを生成する
    let post = await getPostByCustomerId(productId, customer.id)
    if (!post) {
      throw new Error('No valid Post found.')
    }
    if (post.status === Status.cancelled) {
      throw new Error('Already cancelled.')
    }
    const params = {
      ...post,
      cancel_token: uuid.v4(),
      cancel_token_at: new Date().toISOString(),
    } as Post
    post = await dbClient.update<Post>({ pk: post.pk, sk: post.sk }, params)

    const cancelUrl = `${ORIGIN_URL}/product/${productId}/cancel/${post.cancel_token}`
    // 解約ページのURLをメールで送信する
    const text = [
      `${customer.name}様`,
      'いつもご利用頂きありがとうございます。',
      'お手数ですが以下のURLからご契約のプランの解約手続きをお願い致します。',
      '',
      cancelUrl,
    ].join('\n\n')

    // メールを送信します。
    await mailClient.mailSend(undefined, email, '解約手続きのご案内', text)

    res.json({
      message:
        'The URL of the cancellation page was successfully sent via email!',
    })
  } catch (e: unknown) {
    console.error('error', e)
    let message
    if (e instanceof Error) {
      message = e.message
    }
    res.status(500).json({ message })
  }
}

const getPostByCustomerId = async (
  productId: string,
  customerId: string
): Promise<Post | undefined> => {
  const post = await dbClient.scan<Post>(
    'sk = :sk and customer_id = :customer_id',
    undefined,
    {
      ':sk': productId,
      ':customer_id': customerId,
    }
  )
  if (0 === post.length) {
    return undefined
  }
  return post[0]
}

export { cancelRequest }
