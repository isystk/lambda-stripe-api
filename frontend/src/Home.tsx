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
          <Link to="/products" >
            商品一覧
          </Link>
        </div>
        )
}

export default Products;
