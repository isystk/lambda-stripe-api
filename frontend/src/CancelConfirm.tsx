import React, {useState} from 'react';
import useSWR from 'swr';
import axios, {AxiosError} from 'axios';
import Loading from "./Loading";
import { useParams } from 'react-router-dom';
import NotFound from "./NotFound";

const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL??''

function CancelConfirm() {
    const { id: productId, token: cancelToken } = useParams();
    
    const [loading, setLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const { data, error, isLoading } = useSWR([`${REACT_APP_ENDPOINT_URL}/cancel-confirm`, productId, cancelToken], async ([url, productId, cancelToken]) => {
        const result = await axios.post(url, {
            productId, 
            cancelToken,
        });
        return {...result.data};
    });

    if (isLoading) {
        return <></>
    }
    if (error) {
        return <NotFound />
    }

    const cancelSubscription = async () => {
        try {
            setLoading(true)

            // call the backend to create subscription
            const { data: {message, error}} = await axios.post(`${process.env.REACT_APP_ENDPOINT_URL??''}/cancel`, {
              productId, 
              cancelToken,
            })

            setIsComplete(true)
        } catch (e: unknown) {
            console.log(e);
            if (e instanceof AxiosError) {
                const {response} = e
                setErrorMsg(response?.data?.message);
            } else if (e instanceof Error) {
                setErrorMsg(e.message);
            }
        } finally {
            setLoading(false)
        }
    };
    
    return (
    <div>
        <header>
            <h1>商品の解約ページ</h1>
        </header>
        <section className="content">
            {
                !isComplete ? (
                        <>
                            <p className="product-description">以下のプランを解約します。宜しければ「解約する」を押してください。</p>
                            <div className="product-form">
                                <div>
                                    <button className="buy-btn" onClick={cancelSubscription}>解約する</button>
                                </div>
                                {errorMsg && <span className="error">{errorMsg}</span>}
                                <Loading loading={loading} />
                            </div>
                        </>
                    )
                    :
                    <p className="product-description">解約が完了しました。<br/>またのご利用をお待ちしております。</p>
            }
        </section>
    </div>
  );
}

export default CancelConfirm;
