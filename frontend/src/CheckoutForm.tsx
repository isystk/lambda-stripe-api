import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import "./CheckoutForm.css"

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
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const productId = process.env.REACT_APP_PRODUCT_ID;
  
  const stripe = useStripe();
  const elements = useElements();

  const createSubscription = async () => {
    try {
      
      // create a payment method
      const paymentMethod = await stripe?.createPaymentMethod({
        type: "card",
        card: elements?.getElement(CardElement)!,
        billing_details: {
          name,
          email,
        },
      });

      // call the backend to create subscription
      const response = await fetch(process.env.REACT_APP_PAYMENT_API_URL??'', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: paymentMethod?.paymentMethod?.id,
          name,
          email,
          productId
        }),
      }).then((res) => res.json());

      const confirmPayment = await stripe?.confirmCardPayment(
        response.clientSecret
      );

      if (confirmPayment?.error) {
        alert(confirmPayment.error.message);
      } else {
        alert("Success! Check your email for the invoice.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div>
        <div>
            <label htmlFor="name" >名前:</label>
            <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="email">メールアドレス:</label>
            <input
                id="email"
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
    </div>
  );
}

export default CheckoutForm;