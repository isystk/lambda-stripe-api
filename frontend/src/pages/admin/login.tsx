import React, { FC, useState } from 'react'
import AdminTemplate, {
  type AdminTemplateProps,
} from '@/components/06_templates/AdminTemplate'
import useAppRoot from '@/stores/useAppRoot'
import { useRouter } from 'next/router'
import { Api } from '@/constants/api'
import axios, { AxiosError } from '@/utils/axios'
import Loading from '@/components/01_atoms/Loading'
import Input from '@/components/01_atoms/Input'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Url } from '@/constants/url'

type FormInputs = {
  user: string
  password: string
}

const Index: FC = () => {
  const router = useRouter()
  const main = useAppRoot()

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>()

  const validate = {
    userName: {
      required: 'ユーザー名を入力してください',
    },
    password: {
      required: 'パスワードを入力してください',
    },
  }

  // フォーム送信ボタンを押された時の処理
  const onsubmit: SubmitHandler<FormInputs> = async ({
    userName,
    password,
  }) => {
    try {
      setLoading(true)

      const {
        data: { user },
      } = await axios.post(Api.Login, {
        user: userName,
        password,
      })

      if (user) {
        // 認証に成功したらHOME画面にリダイレクト
        router.replace(Url.AdminHome)
      }
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

  const props: AdminTemplateProps = { main, title: 'ログイン' }
  return (
    <AdminTemplate {...props}>
      <section className="max-w-800 mx-auto bg-white px-3 md:px-20 py-12 md:py-20 shadow-md text-center">
        <h2 className="text-2xl mb-8 md:mb-10">ログイン</h2>
        <div>
          <p className="mb-4 leading-6"></p>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div className="flex flex-col mb-4">
              <Input {...{placeholder: "ユーザー名", type: "text", name: "userName", register, validate, errors,}}/>
            </div>
            <div className="flex flex-col mb-4">
              <Input {...{placeholder: "パスワード", type: "password", name: "password", register, validate, errors,}}/>
            </div>
            <div>
              <button
                className="bg-blue-500 rounded-md text-white border-none rounded-5 px-20 py-4 text-18 cursor-pointer mt-10"
                type="submit"
              >
                ログインする
              </button>
            </div>
            {errorMsg && <p className="pt-4 text-red-500">{errorMsg}</p>}
            <Loading loading={loading} />
          </form>
        </div>
      </section>
    </AdminTemplate>
  )
}

export default Index
