import React, {useState} from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Loading from "./Loading";
import { useParams } from 'react-router-dom';

const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL??''

function CancelConfirm() {
    const { id: productId, token: cancelToken } = useParams();
    
    const [loading, setLoading] = useState(false);
    const { data, error } = useSWR([`${REACT_APP_ENDPOINT_URL}/cancel-confirm`, productId, cancelToken], async ([url, productId, cancelToken]) => {
        const result = await axios.post(url, {
            productId, 
            cancelToken,
        });
        return {...result.data};
    });

    if (error) return <div>Server communication failed. Please start Backend if it has not started.</div>
    if (!data) {
        return <></>
    }

    console.log("confirm", data)
    
    const cancelSubscription = async () => {
        try {
            setLoading(true)

            // call the backend to create subscription
            const { data: {message, error}} = await axios.post(`${process.env.REACT_APP_ENDPOINT_URL??''}/cancel`, {
              productId, 
              cancelToken,
            })

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
        <header>
            <h1>商品の解約ページ</h1>
        </header>
        <section className="content">
            <p className="product-description">以下のプランを解約します。宜しければ「解約する」を押してください。</p>
            <div className="product-form">
                <div>
                    <button className="buy-btn" onClick={cancelSubscription}>解約する</button>
                </div>
                <Loading loading={loading} />
            </div>
        </section>
    </div>
  );
}

export default CancelConfirm;
