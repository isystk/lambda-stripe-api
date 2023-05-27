import React, { FC } from 'react'
import AdminTemplate, {
  type AdminTemplateProps,
} from '@/components/06_templates/AdminTemplate'
import useAppRoot from '@/stores/useAppRoot'
import { withAuth } from '@/components/auth'
import { useI18n } from '@/components/i18n'
import useSWR from "swr";
import {Api} from "@/constants/api";
import axios from "@/utils/axios";

const Index: FC = () => {
  const main = useAppRoot()
  const { t } = useI18n('Admin')
  
  const productId = 'prod_NpvV9ohJIlgElI'

  const {
    data: months,
    error,
    isLoading,
  } = useSWR([Api.SubscriberTrend, productId], async ([url, productId]) => {
    const result = await axios.post(url, {
      productId
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
  
  console.log(months)
  
  
  const props: AdminTemplateProps = { main, title: 'HOME' }
  return (
    <AdminTemplate {...props}>
      <section className="bg-white p-6 md:p-12 shadow-md">
        <h2 className="text-2xl mb-8 md:mb-10">HOME</h2>
        <div>
          <p className="mb-4 leading-6">
            {main.user.userName} {t('Hello.')}
          </p>
        </div>
      </section>
    </AdminTemplate>
  )
}

export default withAuth(Index)
