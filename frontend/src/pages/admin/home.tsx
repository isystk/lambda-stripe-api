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
