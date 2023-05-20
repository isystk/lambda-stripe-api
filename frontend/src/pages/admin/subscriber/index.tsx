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
    title: '契約者一覧',
    breadcrumb: [{ label: '契約者一覧' }],
  }
  return (
    <AdminTemplate {...props}>
      <section className="bg-white p-6 md:p-12 shadow-md">
        <h2 className="text-2xl mb-8 md:mb-10">契約者一覧</h2>
        <div></div>
      </section>
    </AdminTemplate>
  )
}

export default withAuth(Index)
