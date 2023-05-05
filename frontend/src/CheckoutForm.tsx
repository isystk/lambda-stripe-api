import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import "./CheckoutForm.css"
import Loading from "./Loading";

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
function CheckoutForm() {
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const planId = process.env.REACT_APP_PLAN_ID;
  
  const stripe = useStripe();
  const elements = useElements();

  const createSubscription = async () => {
    try {
      setLoading(true) 
      // create a payment method
      const paymentMethod = await stripe?.createPaymentMethod({
        type: "card",
        card: elements?.getElement(CardElement)!,
        billing_details: {
          email,
        },
      });

      // call the backend to create subscription
      const {message, error} = await fetch(process.env.REACT_APP_PAYMENT_API_URL??'', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: paymentMethod?.paymentMethod?.id,
          email,
          planId
        }),
      }).then((res) => res.json());

      setLoading(false) 

      alert(message);
    } catch (e: unknown) {
      console.log(e);
      let message
      if (e instanceof Error) {
        message = e.message
      }
      alert(message);
    }
  };
  
  return (
    <div>
        <div className="checkout-form">
            <input
                id="email"
                placeholder="メールアドレス"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="card-element-wrapper">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <div>
            <button className="buy-btn" onClick={createSubscription} disabled={!stripe}>購入する</button>
        </div>
        <Loading loading={loading} />
    </div>
  );
}

export default CheckoutForm;