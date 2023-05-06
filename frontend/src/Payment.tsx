import React from 'react';
import './Payment.css';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import useSWR from 'swr';
import axios from 'axios';
import stripe from "stripe";

const REACT_APP_STRIPE_KEY = process.env.REACT_APP_STRIPE_KEY??''
const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL??''
 
const stripePromise = loadStripe(REACT_APP_STRIPE_KEY);

export type ProductData = {
    plans: stripe.Plan[]
} & stripe.Product

function Payment() {
    
    const productId = process.env.REACT_APP_PRODUCT_ID??'';

    const { data: product, error } = useSWR([`${REACT_APP_ENDPOINT_URL}/product`, productId], async ([url, productId]) => {
        const result = await axios.get(url, {
            params: {
                productId,
            },
        });
        return {...result.data[0]} as ProductData;
    });

    if (error) return <div>Server communication failed. Please start Backend if it has not started.</div>
    if (!product) {
        return <></>
    }
    console.log("product", product)

    return (
    <div>
        <header>
            <h1>{product.name}</h1>
        </header>
        <section id="product-info">
            <img className="product-img" src={product.images[0]} alt={product.name} />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <div className="product-form">
                <Elements stripe={stripePromise}>
                    <CheckoutForm product={product} />
                </Elements>
            </div>
        </section>
    </div>
  );
}

export default Payment;
