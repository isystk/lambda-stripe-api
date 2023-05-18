import React, { FC } from 'react'
import AdminTemplate, {
  type AdminTemplateProps,
} from '@/components/06_templates/AdminTemplate'
import useAppRoot from '@/stores/useAppRoot'
import { withAuth } from './auth'

const Index: FC = () => {
  const main = useAppRoot()

  const props: AdminTemplateProps = { main, title: 'HOME' }
  return (
    <AdminTemplate {...props}>
      <section className="max-w-800 mx-auto bg-white px-3 md:px-20 py-12 md:py-20 shadow-md text-center">
        <h2 className="text-2xl mb-8 md:mb-10">HOME</h2>
        <div>
          <p className="mb-4 leading-6">
            {main.user.userName}さん。こんにちわ。
          </p>
        </div>
      </section>
    </AdminTemplate>
  )
}

export default withAuth(Index)
