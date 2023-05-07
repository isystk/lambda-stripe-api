import React, {useState} from 'react';
import axios from 'axios';
import Loading from "./Loading";
import { useParams } from 'react-router-dom';

const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL??''

function Cancel() {
    const { id: productId } = useParams();
    
    const [loading, setLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    
    const cancelRequest = async () => {
        try {
            setLoading(true)

            // 解約処理をする
            const { data: {message, error}} = await axios.post(`${process.env.REACT_APP_ENDPOINT_URL??''}/cancel-request`, {
                productId,
                email,
            })

            setIsComplete(true);
            
        } catch (e: unknown) {
            console.log(e);
            if (e instanceof Error) {
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
                            {errorMsg && <span className="error">{errorMsg}</span>}
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
