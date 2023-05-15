import React, { FC, useState } from 'react'
import InputFormTemplate, {
  type InputFormTemplateProps,
} from '@/components/06_templates/InputFormTemplate'
import useAppRoot from '@/stores/useAppRoot'
import { useRouter } from 'next/router'
import { Api } from '@/constants/api'
import axios, { AxiosError } from 'axios'
import Loading from '@/components/01_atoms/Loading'

const Index: FC = () => {
  const {
    query: { id: productId },
  } = useRouter()
  const main = useAppRoot()

  const [loading, setLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const cancelRequest = async () => {
    try {
      setLoading(true)

      // 解約リクエストを送信する
      const {
        data: { message, error },
      } = await axios.post(Api.CancelRequest, {
        productId,
        email,
      })

      setIsComplete(true)
    } catch (e: unknown) {
      console.log(e)
      if (e instanceof AxiosError) {
        const { response } = e
        setErrorMsg(response?.data?.message)
      } else if (e instanceof Error) {
        setErrorMsg(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!main) return <></>

  const props: InputFormTemplateProps = { main, title: '商品の解約ページ' }
  return (
    <InputFormTemplate {...props}>
      <section className="max-w-800 mx-auto bg-white px-3 md:px-20 py-12 md:py-20 shadow-md text-center">
        <h2 className="text-36 mb-12 md:mb-20">商品の解約ページ</h2>
        <div>
          {!isComplete ? (
            <>
              <p className="text-36 mb-4">メールアドレスを入力してください。</p>
              <div>
                <div className="flex flex-col mb-4">
                  <input
                    id="email"
                    placeholder="メールアドレス"
                    type="email"
                    value={email}
                    className="p-3 bg-gray-200 rounded-md"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    className="bg-blue-500 rounded-md text-white border-none rounded-5 px-20 py-4 text-18 cursor-pointer mt-10"
                    onClick={cancelRequest}
                  >
                    メールを送信する
                  </button>
                </div>
                {errorMsg && <p className="pt-4 text-red-500">{errorMsg}</p>}
                <Loading loading={loading} />
              </div>
            </>
          ) : (
            <p className="product-description">
              解約ページのリンクをメールアドレス宛に送信しました。
              <br />
              メールに記載のURLから解約の手続きを行ってください。
            </p>
          )}
        </div>
      </section>
    </InputFormTemplate>
  )
}

export default Index
