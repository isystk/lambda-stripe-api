import React, {useState} from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Loading from "./Loading";

const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL??''

function Cancel() {

    const [loading, setLoading] = useState(false);
    const planId = process.env.REACT_APP_PLAN_ID??'';
    const email = "test@test.com"
    const { data, error } = useSWR([`${REACT_APP_ENDPOINT_URL}/active-check`, planId, email], async ([url, planId, email]) => {
        const result = await axios.post(url, {
            planId, 
            email,
        });
        return {...result.data};
    });

    if (error) return <div>Server communication failed. Please start Backend if it has not started.</div>
    if (!data) {
        return <></>
    }
    
    const cancelSubscription = async () => {
        try {
            setLoading(true)

            // call the backend to create subscription
            const {message, error} = await fetch(`${process.env.REACT_APP_ENDPOINT_URL??''}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
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
        <header>
            <h1>商品の解約ページ</h1>
        </header>
        <section id="product-info">
            <p className="product-description">{data.status ? '契約中': '未契約'}</p>
            <div className="product-form">
                <div className="checkout-form">
                    <input
                        id="planId"
                        type="test"
                        value={planId}
                        disabled={true}
                    />
                </div>
                <div className="checkout-form">
                    <input
                        id="email"
                        type="test"
                        value={email}
                        disabled={true}
                    />
                </div>
                <div>
                    <button className="buy-btn" onClick={cancelSubscription}>解約する</button>
                </div>
                <Loading loading={loading} />
            </div>
        </section>
    </div>
  );
}

export default Cancel;
