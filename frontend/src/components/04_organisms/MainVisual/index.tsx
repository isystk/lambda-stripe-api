import React, { FC, useContext } from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'
import { connect } from '@/components/hoc'
import MainService from '@/services/main'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import LineButton from '@/components/01_atoms/LineButton'
import { useI18n } from '@/components/i18n'
import ScrollIn from '@/components/02_interactions/ScrollIn'

/** MainVisualProps Props */
export type MainVisualProps = WithChildren
/** Presenter Props */
export type PresenterProps = MainVisualProps & {
  main
  t
}

/** Presenter Component */
const MainVisualPresenter: FC<PresenterProps> = ({ main, t, ...props }) => (
  <>
    <section
      className={`${styles.mainVisual}`}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <div className="flex flex-wrap items-center h-full bg-main justify-center">
        <div className="flex w-full md:w-1/2 justify-center md:justify-end md:pr-16">
          <img src="/images/iphone.png" className="w-36 md:w-72"></img>
        </div>
        <div className="flex w-full md:w-1/2 justify-center md:justify-start pb-8">
          <div className="px-8">
            <ScrollIn delay="0s">
              <p className="text-accent text-xl md:text-3xl font-bold mb-6 ">
                {t('One million registered within one month of release!')}
              </p>
            </ScrollIn>
            <ScrollIn delay="1s">
              <h1 className="text-gray-700 text-2xl md:text-4xl font-bold mb-6 ">
                {t('The topic of ________. Available on line!')}
              </h1>
            </ScrollIn>
            <ScrollIn delay="2s">
              <LineButton
                link="#"
                label={t('Add me as a friend and ask me a question')}
              />
            </ScrollIn>
          </div>
        </div>
      </div>
    </section>
  </>
)

/** Container Component */
const MainVisualContainer: React.FC<
  ContainerProps<MainVisualProps, PresenterProps>
> = ({ presenter, children, ...props }) => {
  const main = useContext<MainService | null>(Context)
  const { t } = useI18n('Common')

  if (!main) return <></>

  return presenter({
    children,
    main,
    t,
    ...props,
  })
}

export default connect<MainVisualProps, PresenterProps>(
  'MainVisual',
  MainVisualPresenter,
  MainVisualContainer
)
