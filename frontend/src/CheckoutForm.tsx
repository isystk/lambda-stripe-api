import React, { useState } from "react";
import axios from 'axios';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useForm, type SubmitHandler } from 'react-hook-form';
import "./CheckoutForm.css"
import Loading from "./Loading";
import {ProductData} from "./Product";
import {PaymentMethodResult} from "@stripe/stripe-js";

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
          color: '#a9a9a9'
        }
      }
  }
};

type InputTypes = {
    product: ProductData
}

type FormInputs = { 
    name: string 
    email: string
    planId: string 
};

function CheckoutForm({product}: InputTypes) {

  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardErrorMsg, setCardErrorMsg] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

 // フォーム送信ボタンを押された時の処理
  const onsubmit: SubmitHandler<FormInputs> = async ({planId, name, email}) => {
    try {
        
      // create a payment method
      const payment: PaymentMethodResult|undefined = await stripe?.createPaymentMethod({
        type: "card",
        card: elements?.getElement(CardElement)!,
        billing_details: {
          email,
        },
      });
      if (!payment) {
        setCardErrorMsg('カード情報を入力してください');
        return;
      }
      if (payment.error) {
        setCardErrorMsg(payment.error.message??'カード情報が不正です');
        return;
      }
      setLoading(true) 
      
      // 決済処理をする
      const { data} = await axios.post(`${process.env.REACT_APP_ENDPOINT_URL??''}/payment`, {
        paymentMethod: payment.paymentMethod?.id,
        name,
        email,
        planId
      })
      reset();

      setIsComplete(true)
    } catch (e: unknown) {
      console.log(e);
      let message
      if (e instanceof Error) {
        message = e.message
      }
      alert(message);
    } finally {
      setLoading(false)
    }

  };
  
  return (
    <div>
        {
            !isComplete ? (
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <div className="product-plan">
                            {product.plans.map(({id, amount , currency }, idx) => {
                                const amountFmt = amount ? new Intl.NumberFormat('ja-JP', { style: 'currency', currency }).format(amount) : ''
                                return (
                                    <div key={id}>
                                        <input
                                            type="radio"
                                            checked={idx === 0}
                                            value={id}
                                            {...register("planId", { required: true })}
                                        />
                                        <p className="product-price">{amountFmt}</p>
                                    </div>
                                )
                            })}
                            {errors.planId && <span className="error">プランを選択してください</span>}
                        </div>
                        <div className="checkout-form">
                            <input
                                placeholder="お名前"
                                type="text"
                                {...register("name", { required: true })}
                            />
                            {errors.name && <span className="error">お名前を入力してください</span>}
                        </div>
                        <div className="checkout-form">
                            <input
                                placeholder="メールアドレス"
                                type="email"
                                {...register("email", { required: true })}
                            />
                            {errors.email && <span className="error">メールアドレスを入力してください</span>}
                        </div>
                        <div className="card-element-wrapper">
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
                            {cardErrorMsg && <span className="error">{cardErrorMsg}</span>}
                        </div>
                        <div>
                            <button className="buy-btn" type="submit" disabled={!stripe}>購入する</button>
                        </div>
                    </form>
                )
                :
                <p className="product-description">解約ページのリンクをメールアドレス宛に送信しました。<br/>メールに記載のURLから解約の手続きを行ってください。</p>
        }
        <Loading loading={loading} />
    </div>
  );
}

export default CheckoutForm;