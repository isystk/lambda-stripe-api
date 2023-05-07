import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import useSWR from 'swr';
import axios from 'axios';
import stripe from "stripe";
import { type ProductData} from './Product'
import { Link } from 'react-router-dom'

const REACT_APP_STRIPE_KEY = process.env.REACT_APP_STRIPE_KEY??''
const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL??''
 
function Products() {

    const { data: products, error } = useSWR([`${REACT_APP_ENDPOINT_URL}/product`], async ([url]) => {
        const result = await axios.get(url);
        return [...result.data] as ProductData[];
    });

    if (error) return <div>Server communication failed. Please start Backend if it has not started.</div>
    if (!products) {
        return <></>
    }

    return (
        <div className="container py-5">
          <h1 className="mb-4">商品一覧</h1>
          <div className="row">
            {products.map((product) => {
              if (0 === product.plans.length) {
                  return <></>
              }
              const { currency, amount } = product.plans[0]
              const amountFmt = amount ? new Intl.NumberFormat('ja-JP', { style: 'currency', currency }).format(amount) : ''
              return (
                <div key={product.id} className="col-md-6 mb-4">
                    <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{amountFmt}</h6>
                        <p className="card-text">{product.description}</p>
                        <Link to={`/products/${product.id}`} className="btn btn-primary">
                        詳細を見る
                        </Link>
                    </div>
                    </div>
                </div>
              )
            })}
          </div>
        </div>
        )
}

export default Products;
