import React, { FC, useState } from 'react'
import InputFormTemplate, {
  type InputFormTemplateProps,
} from '@/components/06_templates/InputFormTemplate'
import useAppRoot from '@/stores/useAppRoot'
import { useRouter } from 'next/router'
import { Api } from '@/constants/api'
import axios, { AxiosError } from '@/utils/axios'
import Loading from '@/components/01_atoms/Loading'
import Input from '@/components/01_atoms/Input'
import { useForm, type SubmitHandler } from 'react-hook-form'

type FormInputs = {
  email: string
}

const Index: FC = () => {
  const {
    query: { id: productId },
  } = useRouter()
  const main = useAppRoot()

  const [loading, setLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>()

  const validate = {
    email: {
      required: 'メールアドレスを入力してください',
      pattern: {
        value: /[\w\-\\._]+@[\w\-\\._]+\.[A-Za-z]+/,
        message: 'メールアドレスを正しく入力してください',
      },
    },
  }

  // フォーム送信ボタンを押された時の処理
  const onsubmit: SubmitHandler<FormInputs> = async ({ email }) => {
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
        <h2 className="text-2xl mb-8 md:mb-10">商品の解約ページ</h2>
        <div>
          {!isComplete ? (
            <>
              <p className="mb-4 leading-6">
                入力して頂いたメールアドレス宛に解約ページのURLを記載したメールをお送りさせて頂きます。
              </p>
              <form onSubmit={handleSubmit(onsubmit)}>
                <div className="flex flex-col mb-4">
                  <Input {...{placeholder: "メールアドレス", type: "email", name: "email", register, validate, errors,}}/>
                </div>
                <div>
                  <button
                    className="bg-blue-500 rounded-md text-white border-none rounded-5 px-20 py-4 text-18 cursor-pointer mt-10"
                    type="submit"
                  >
                    メールを送信する
                  </button>
                </div>
                {errorMsg && <p className="pt-4 text-red-500">{errorMsg}</p>}
                <Loading loading={loading} />
              </form>
            </>
          ) : (
            <p className="mb-4 leading-6">
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
