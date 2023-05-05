import React from 'react';
import './App.css';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY??'');

function App() {
  return (
    <div>
        <header>
            <h1>ペライチの商品ページ</h1>
        </header>
        <section id="product-info">
            <img className="product-img" src="/guiter.jpg" alt="商品の画像" />
            <h2 className="product-name">商品名</h2>
            <p className="product-price">¥99,999</p>
            <p className="product-description">ここに商品の説明文を入力してください。ここに商品の説明文を入力してください。ここに商品の説明文を入力してください。ここに商品の説明文を入力してください。ここに商品の説明文を入力してください。ここに商品の説明文を入力してください。</p>
            <div className="product-form">
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </section>
    </div>
  );
}

export default App;
