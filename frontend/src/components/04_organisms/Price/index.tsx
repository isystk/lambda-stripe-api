import React, { FC, useContext } from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'
import { connect } from '@/components/hoc'
import MainService from '@/services/main'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import LineButton from '@/components/01_atoms/LineButton'
import ScrollIn from '@/components/01_atoms/ScrollIn'

/** PriceProps Props */
export type PriceProps = WithChildren
/** Presenter Props */
export type PresenterProps = PriceProps & {
  main
}

/** Presenter Component */
const PricePresenter: FC<PresenterProps> = ({ main, ...props }) => (
  <>
    <section className={`${styles.price}`}>
      <div className="flex items-center bg-black justify-center w-full">
        <div className="py-32 w-full">
          <ScrollIn>
            <p className="text-white font-bold text-3xl md:mb-16 text-center">
              PRICE
            </p>
          </ScrollIn>
          <div className="flex flex-wrap items-center p-8 md:mb-16">
            <div className="flex w-full md:w-1/2 justify-end items-center">
              <ScrollIn className="w-full md:w-72 md:mr-8">
                <div className="bg-white bg-opacity-20 rounded-lg py-16 h-64 mb-8 md:mb-0">
                  <p className="text-white text-center mb-8">
                    チャット回数制限あり
                  </p>
                  <p className="text-white font-bold text-center text-5xl">
                    無料
                  </p>
                </div>
              </ScrollIn>
            </div>
            <div className="flex w-full md:w-1/2 justify-start items-center">
              <ScrollIn className="w-full md:w-72 md:ml-8">
                <div className="bg-white bg-opacity-20 rounded-lg py-16 h-64 ">
                  <p className="text-white text-center mb-8">チャット無制限</p>
                  <div className="px-12">
                    <p className="text-white font-bold text-left text-4xl">
                      <span className="text-white text-xl mr-4">月額</span>¥980
                    </p>
                    <p className="text-white font-bold text-left text-4xl">
                      <span className="text-white text-xl mr-4">年額</span>
                      ¥9,800
                    </p>
                  </div>
                </div>
              </ScrollIn>
            </div>
          </div>
          <div className="flex items-center justify-center px-8">
            <LineButton link="#" label="友達に追加して質問してみる" />
          </div>
        </div>
      </div>
    </section>
  </>
)

/** Container Component */
const PriceContainer: React.FC<ContainerProps<PriceProps, PresenterProps>> = ({
  presenter,
  children,
  ...props
}) => {
  const main = useContext<MainService | null>(Context)
  if (!main) return <></>

  return presenter({
    children,
    main,
    ...props,
  })
}

export default connect<PriceProps, PresenterProps>(
  'Price',
  PricePresenter,
  PriceContainer
)
