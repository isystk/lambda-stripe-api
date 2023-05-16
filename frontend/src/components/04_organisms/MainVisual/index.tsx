import React, { FC, useContext } from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'
import { connect } from '@/components/hoc'
import MainService from '@/services/main'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import LineButton from '@/components/01_atoms/LineButton'

/** MainVisualProps Props */
export type MainVisualProps = WithChildren
/** Presenter Props */
export type PresenterProps = MainVisualProps & {
  main
}

/** Presenter Component */
const MainVisualPresenter: FC<PresenterProps> = ({ main, ...props }) => (
  <>
    <section className={`${styles.mainVisual} h-screen`}>
      <div className="flex flex-wrap items-center h-full bg-main justify-center">
        <div className="flex w-full md:w-1/2 justify-center md:justify-end md:pr-16 pb-8">
          <img src="/images/iphone.png" className="w-48 md:w-72"></img>
        </div>
        <div className="flex w-full md:w-1/2 justify-center md:justify-start pb-8">
          <div className="px-8">
            <p className="text-accent text-xl md:text-3xl font-bold mb-6 ">
              リリース1ヶ月で100万人登録！
            </p>
            <h1 className="text-gray-700 text-2xl md:text-4xl font-bold mb-6 ">
              話題の○○が
              <br />
              LINEで使える！
            </h1>
            <LineButton link="#" label="友達に追加して質問してみる" />
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
  if (!main) return <></>

  return presenter({
    children,
    main,
    ...props,
  })
}

export default connect<MainVisualProps, PresenterProps>(
  'MainVisual',
  MainVisualPresenter,
  MainVisualContainer
)
