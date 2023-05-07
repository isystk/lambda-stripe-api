import React, {useState} from 'react';
import Loading from "./Loading";
import { useParams } from 'react-router-dom';

const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL??''

function Cancel() {
    const { id: productId } = useParams();
    
    const [loading, setLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [email, setEmail] = useState("");
    
    const cancelRequest = async () => {
        try {
            setLoading(true)

            // call the backend to create subscription
            const {message, error} = await fetch(`${process.env.REACT_APP_ENDPOINT_URL??''}/cancel-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    email,
                }),
            }).then((res) => res.json());

            setLoading(false)

            setIsComplete(true);
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
            {
                !isComplete ? (
                    <>
                        <p className="product-description">メールアドレスを入力してください。</p>
                        <div className="product-form">
                            <div className="checkout-form">
                                <input
                                    id="email"
                                    placeholder="メールアドレス"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <button className="buy-btn" onClick={cancelRequest}>メールを送信する</button>
                            </div>
                            <Loading loading={loading} />
                        </div>
                    </>
                ) 
                :
                    <p className="product-description">解約ページのリンクをメールアドレス宛に送信しました。<br/>メールに記載のURLから解約の手続きを行ってください。</p>
            }
        </section>
    </div>
  );
}

export default Cancel;
