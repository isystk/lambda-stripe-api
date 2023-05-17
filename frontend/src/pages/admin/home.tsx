import React, { FC } from 'react'
import AdminTemplate, {
  type AdminTemplateProps,
} from '@/components/06_templates/AdminTemplate'
import useAppRoot from '@/stores/useAppRoot'
import axios from '@/utils/axios'
import useSWR from 'swr'
import { Api } from '@/constants/api'
import { Url } from '@/constants/url'
import { useRouter } from 'next/router'

const Index: FC = () => {
  const router = useRouter()

  const main = useAppRoot()

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(Api.LoginCheck, async (url) => {
    const result = await axios.post(url)
    return { ...result.data }
  })

  if (isLoading) return <div>Loading...</div>

  if (!user.userName) {
    // 認証が確認できない場合はログイン画面にリダイレクト
    router.replace(Url.AdminLogin)
    return
  }

  if (!main) return <></>

  const props: AdminTemplateProps = { main, title: 'HOME' }
  return (
    <AdminTemplate {...props}>
      <section className="max-w-800 mx-auto bg-white px-3 md:px-20 py-12 md:py-20 shadow-md text-center">
        <h2 className="text-2xl mb-8 md:mb-10">HOME</h2>
        <div>
          <p className="mb-4 leading-6">{user.userName}さん。こんにちわ。</p>
        </div>
      </section>
    </AdminTemplate>
  )
}

export default Index
