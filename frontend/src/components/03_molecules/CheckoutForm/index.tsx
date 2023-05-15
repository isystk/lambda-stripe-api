import React, { FC, useContext, useState } from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'
import { connect } from '@/components/hoc'
import MainService from '@/services/main'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import Loading from '@/components/01_atoms/Loading'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useForm, type SubmitHandler } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { PaymentMethodResult } from '@stripe/stripe-js'
import { Api } from '@/constants/api'
import * as stripe from 'stripe'

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true, // 郵便番号を非表示
  style: {
    base: {
      fontFamily: 'Sans Serif',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '16px',
      letterSpacing: '1px',
      color: '#333333',
      '::placeholder': {
        color: '#a9a9a9',
      },
    },
  },
}

type FormInputs = {
  name: string
  email: string
  planId: string
}

export type ProductData = {
  plans: stripe.Plan[]
} & stripe.Product

/** CheckoutFormProps Props */
export type CheckoutFormProps = WithChildren & {
  product: ProductData
  userKey?: string
}
/** Presenter Props */
export type PresenterProps = CheckoutFormProps & {
  main
  onsubmit
  product
  isComplete
  loading
  cardErrorMsg
  errorMsg
  register
  handleSubmit
  errors
  stripe
}

/** Presenter Component */
const CheckoutFormPresenter: FC<PresenterProps> = ({
  main,
  onsubmit,
  product,
  isComplete,
  loading,
  cardErrorMsg,
  errorMsg,
  register,
  handleSubmit,
  errors,
  validate,
  stripe,
  ...props
}) => (
  <>
    <div>
      {!isComplete ? (
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="flex flex-wrap items-center md:mb-8">
            {product.plans.map(({ id, amount, currency }, idx) => {
              const amountFmt = amount
                ? new Intl.NumberFormat('ja-JP', {
                    style: 'currency',
                    currency,
                  }).format(amount)
                : ''
              return (
                <div key={id} className="w-full md:w-1/2">
                  <div className="bg-black rounded-lg md:mr-4 py-12 h-72 mb-8">
                    <p className="text-white text-center mb-12">プラン</p>
                    <p className="text-white font-bold text-center text-5xl mb-12">
                      {amountFmt}
                    </p>
                    <input
                      type="radio"
                      checked={idx === 0}
                      value={id}
                      {...register('planId', validate['planId'])}
                    />
                  </div>
                </div>
              )
            })}
            {errors.planId && (
              <span className="pt-4 text-red-500">{errors.planId.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              placeholder="お名前"
              type="text"
              className="p-3 bg-gray-200 rounded-md"
              {...register('name', validate['name'])}
            />
            {errors.name && (
              <span className="pt-4 text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              placeholder="メールアドレス"
              type="email"
              className="p-3 bg-gray-200 rounded-md"
              {...register('email', validate['email'])}
            />
            {errors.email && (
              <span className="pt-4 text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="p-4 bg-gray-200 rounded-md">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            {cardErrorMsg && (
              <span className="pt-4 text-red-500">{cardErrorMsg}</span>
            )}
          </div>
          <div>
            <button
              className="bg-blue-500 rounded-md text-white border-none rounded-5 px-20 py-4 text-18 cursor-pointer mt-10"
              type="submit"
              disabled={!stripe}
            >
              購入する
            </button>
          </div>
          {errorMsg && <p className="pt-4 text-red-500">{errorMsg}</p>}
        </form>
      ) : (
        <p className="text-18 text-left mb-20">購入が完了しました。</p>
      )}
      <Loading loading={loading} />
    </div>
  </>
)

/** Container Component */
const CheckoutFormContainer: React.FC<
  ContainerProps<CheckoutFormProps, PresenterProps>
> = ({ presenter, children, product, userKey, ...props }) => {
  const main = useContext<MainService | null>(Context)
  if (!main) return <></>

  const [isComplete, setIsComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cardErrorMsg, setCardErrorMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const stripe = useStripe()
  const elements = useElements()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>()

  const validate = {
    planId: {
      required: 'プランを選択してください',
    },
    name: {
      required: 'お名前を入力してください',
      max: { value: 30, message: 'お名前は３０文字以内で入力してください' },
    },
    email: {
      required: 'メールアドレスを入力してください',
      pattern: {
        value: /[\w\-\\._]+@[\w\-\\._]+\.[A-Za-z]+/,
        message: 'メールアドレスを正しく入力してください',
      },
    },
  }

  // フォーム送信ボタンを押された時の処理
  const onsubmit: SubmitHandler<FormInputs> = async ({
    planId,
    name,
    email,
  }) => {
    try {
      // create a payment method
      const payment: PaymentMethodResult | undefined =
        await stripe?.createPaymentMethod({
          type: 'card',
          card: elements?.getElement(CardElement),
          billing_details: {
            email,
          },
        })
      if (!payment) {
        setCardErrorMsg('カード情報を入力してください')
        return
      }
      if (payment.error) {
        setCardErrorMsg(payment.error.message ?? 'カード情報が不正です')
        return
      }
      setLoading(true)

      // 決済処理をする
      const { data } = await axios.post(Api.Payment, {
        userKey: userKey ?? email,
        paymentMethod: payment.paymentMethod?.id,
        name,
        email,
        planId,
      })
      reset()

      setIsComplete(true)
    } catch (e: unknown) {
      console.log(e)
      if (e instanceof AxiosError) {
        const { response } = e
        setErrorMsg(response?.data?.message)
      } else if (e instanceof Error) {
        setErrorMsg(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return presenter({
    children,
    main,
    onsubmit,
    product,
    isComplete,
    loading,
    cardErrorMsg,
    errorMsg,
    register,
    handleSubmit,
    errors,
    validate,
    stripe,
    ...props,
  })
}

export default connect<CheckoutFormProps, PresenterProps>(
  'CheckoutForm',
  CheckoutFormPresenter,
  CheckoutFormContainer
)
