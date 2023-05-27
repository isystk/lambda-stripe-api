import React, { FC, useState, useEffect } from 'react'
import AdminTemplate, {
  type AdminTemplateProps,
} from '@/components/06_templates/AdminTemplate'
import useAppRoot from '@/stores/useAppRoot'
import { withAuth } from '@/components/auth'
import { useI18n } from '@/components/i18n'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Api } from '@/constants/api'
import axios from '@/utils/axios'
import { dateFormat, unixTimeToDate } from '@/utils/general'
import Table, { TableProps } from '@/components/01_atoms/Table'
import { TableColumn } from 'react-data-table-component'

const Index: FC = () => {
  const main = useAppRoot()
  const { t } = useI18n('Admin')
  const {
    query: { productName, customerName },
  } = useRouter()
  const [fProductName, setFProductName] = useState('')
  const [fCustomerName, setFCustomerName] = useState('')
  
  useEffect(() => {
    setFProductName(Array.isArray(productName) ? productName[0]: productName) 
    setFCustomerName(Array.isArray(customerName) ? customerName[0]: customerName) 
  }, [productName, customerName])

  const {
    data: customers,
    error,
    isLoading,
  } = useSWR(Api.Subscriber, async (url) => {
    const result = await axios.post(url)
    if (0 === result.data.length) {
      return undefined
    }
    return result.data
  })

  if (isLoading) {
    // loading
    return <></>
  }

  const columns: TableColumn<Record<never, never>>[] = [
    {
      name: '商品名',
      sortable: true,
      selector: (row: { productName: string }) => row.productName,
    },
    {
      name: '顧客名',
      sortable: true,
      selector: (row: { customerName: string }) => row.customerName,
    },
    {
      name: 'メールアドレス',
      sortable: true,
      selector: (row: { email: string }) => row.email,
    },
    {
      name: 'プラン',
      sortable: true,
      selector: (row: {
        currency: string
        amount: number
        interval: string
      }) => {
        const amountFmt = row.amount
          ? new Intl.NumberFormat('ja', {
              style: 'currency',
              currency: row.currency,
            }).format(row.amount)
          : ''
        const interval =
          row.interval === 'month'
            ? t('monthly amount')
            : row.interval === 'year'
            ? t('yearly amount')
            : 'その他'
        return `${interval} ${amountFmt}`
      },
    },
    {
      name: 'ステータス',
      sortable: true,
      selector: (row: { status: string }) => row.status,
    },
    {
      name: '契約開始日',
      sortable: true,
      selector: (row: { current_period_start: number }) =>
        row.current_period_start &&
        dateFormat(unixTimeToDate(row.current_period_start)),
    },
    {
      name: '解約予定日',
      sortable: true,
      selector: (row: { cancel_at: number }) =>
        row.cancel_at && dateFormat(unixTimeToDate(row.cancel_at)),
    },
  ]
  const tableProps: TableProps = {
    columns,
    data: customers.filter(({ productName, customerName }) => {
      if (fProductName && productName !== fProductName) {
        return false
      }
      if (fCustomerName && customerName !== fCustomerName) {
        return false
      }
      return true
    }),
  }

  const props: AdminTemplateProps = {
    main,
    title: '契約一覧',
    breadcrumb: [{ label: '契約一覧' }],
  }
  return (
    <AdminTemplate {...props}>
      <section className="bg-white p-6 md:p-12 shadow-md">
        <h2 className="text-2xl mb-8 md:mb-10">契約一覧</h2>

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
                placeholder="商品名"
                value={fProductName}
                onChange={(e) => setFProductName(e.target.value)}
              />
            </div>
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
                placeholder="顧客名"
                value={fCustomerName}
                onChange={(e) => setFCustomerName(e.target.value)}
              />
            </div>
          </div>
        </form>

        {/* 契約一覧 */}
        <div className="overflow-x-auto">
          <Table {...tableProps} />
        </div>
      </section>
    </AdminTemplate>
  )
}

export default withAuth(Index)
