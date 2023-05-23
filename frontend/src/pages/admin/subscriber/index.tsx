import React, { FC } from 'react'
import AdminTemplate, {
  type AdminTemplateProps,
} from '@/components/06_templates/AdminTemplate'
import Image from '@/components/01_atoms/Image'
import useAppRoot from '@/stores/useAppRoot'
import { withAuth } from '@/components/auth'
import { useI18n } from '@/components/i18n'
import useSWR from 'swr'
import { Api } from '@/constants/api'
import axios from '@/utils/axios'

const Index: FC = () => {
  const main = useAppRoot()
  const { t } = useI18n('Admin')

  const productId = 'prod_NpvV9ohJIlgElI'

  const {
    data: customers,
    error,
    isLoading,
  } = useSWR([Api.Customer, productId], async ([url, productId]) => {
    const result = await axios.post(url, {
      productId,
    })
    if (0 === result.data.length) {
      return undefined
    }
    return result.data
  })

  if (isLoading) {
    // loading
    return <></>
  }

  console.log(customers)

  const props: AdminTemplateProps = {
    main,
    title: '契約者一覧',
    breadcrumb: [{ label: '契約者一覧' }],
  }
  return (
    <AdminTemplate {...props}>
      <section className="bg-white p-6 md:p-12 shadow-md">
        <h2 className="text-2xl mb-8 md:mb-10">契約者一覧</h2>

        {/* 検索フォーム */}
        <form className="mb-6">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="product-name"
              >
                顧客名
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="product-name"
                type="text"
                placeholder="例：太郎"
              />
            </div>
          </div>
        </form>

        {/* 契約者一覧 */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="border px-4 py-2">顧客名</th>
                <th className="border px-4 py-2">メールアドレス</th>
                <th className="border px-4 py-2">サブスクリプション</th>
                <th className="border px-4 py-2">登録日</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((e) => {
                return (
                  <tr key={e.id} data-id={e.id}>
                    <td className="border px-4 py-2">{e.name}</td>
                    <td className="border px-4 py-2">{e.email}</td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ページング */}
        <div className="flex items-center justify-center mt-6">
          <a
            href="#"
            className="inline-block bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-l hover:bg-gray-300"
          >
            前へ
          </a>
          <a
            href="#"
            className="inline-block bg-blue-500 text-white font-bold px-4 py-2 hover:bg-blue-700"
          >
            1
          </a>
          <a
            href="#"
            className="inline-block bg-gray-200 text-gray-700 font-bold px-4 py-2 hover:bg-gray-300"
          >
            2
          </a>
          <a
            href="#"
            className="inline-block bg-gray-200 text-gray-700 font-bold px-4 py-2 hover:bg-gray-300"
          >
            3
          </a>
          <a
            href="#"
            className="inline-block bg-gray-200 text-gray-700 font-bold px-4 py-2 hover:bg-gray-300"
          >
            4
          </a>
          <a
            href="#"
            className="inline-block bg-gray-200 text-gray-700 font-bold px-4 py-2 hover:bg-gray-300"
          >
            5
          </a>
          <a
            href="#"
            className="inline-block bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-r hover:bg-gray-300"
          >
            次へ
          </a>
        </div>
      </section>
    </AdminTemplate>
  )
}

export default withAuth(Index)
