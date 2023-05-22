import React, { FC } from 'react'
import AdminTemplate, {
  type AdminTemplateProps,
} from '@/components/06_templates/AdminTemplate'
import useAppRoot from '@/stores/useAppRoot'
import { withAuth } from '@/components/auth'
import { useI18n } from '@/components/i18n'

const Index: FC = () => {
  const main = useAppRoot()
  const { t } = useI18n('Admin')

  const props: AdminTemplateProps = {
    main,
    title: '商品一覧',
    breadcrumb: [{ label: '商品一覧' }],
  }
  return (
    <AdminTemplate {...props}>
      <section className="bg-white p-6 md:p-12 shadow-md">
        <h2 className="text-2xl mb-8 md:mb-10">商品一覧</h2>

        {/* 検索フォーム */}
        <form className="mb-6">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="product-name"
              >
                商品名
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="product-name"
                type="text"
                placeholder="例：ワイン"
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="product-category"
              >
                カテゴリー
              </label>
              <div className="relative">
                <select
                  className="appearance-none block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="product-category"
                >
                  <option>すべてのカテゴリー</option>
                  <option>ワイン</option>
                  <option>ビール</option>
                  <option>ウイスキー</option>
                  <option>その他</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M14.35 7.51l-1.9-1.9c-.2-.2-.51-.2-.71 0l-1.89 1.9c-.2.2-.2.51 0 .71l3.8 3.8c.2.2.51.2.71 0l3.8-3.8c.2-.2.2-.51 0-.71l-1.89-1.9c-.19-.19-.5-.19-.7 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="product-brand"
              >
                ブランド
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="product-brand"
                type="text"
                placeholder="例：山梨ワイナリー"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              検索
            </button>
          </div>
        </form>

        {/* 商品一覧 */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">商品名</th>
                <th className="border px-4 py-2">カテゴリー</th>
                <th className="border px-4 py-2">ブランド</th>
                <th className="border px-4 py-2">価格</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">ワイン 甲州</td>
                <td className="border px-4 py-2">ワイン</td>
                <td className="border px-4 py-2">山梨ワイナリー</td>
                <td className="border px-4 py-2">¥1,500</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">ワイン 甲州</td>
                <td className="border px-4 py-2">ワイン</td>
                <td className="border px-4 py-2">山梨ワイナリー</td>
                <td className="border px-4 py-2">¥1,500</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">ワイン 甲州</td>
                <td className="border px-4 py-2">ワイン</td>
                <td className="border px-4 py-2">山梨ワイナリー</td>
                <td className="border px-4 py-2">¥1,500</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">ワイン 甲州</td>
                <td className="border px-4 py-2">ワイン</td>
                <td className="border px-4 py-2">山梨ワイナリー</td>
                <td className="border px-4 py-2">¥1,500</td>
              </tr>
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