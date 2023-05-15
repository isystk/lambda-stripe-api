import React, { FC, useContext } from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'
import { connect } from '@/components/hoc'
import MainService from '@/services/main'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import ScrollIn from '@/components/01_atoms/ScrollIn'

/** NewsProps Props */
export type NewsProps = WithChildren
/** Presenter Props */
export type PresenterProps = NewsProps & {
  main
}

/** Presenter Component */
const NewsPresenter: FC<PresenterProps> = ({ main, ...props }) => (
  <>
    <section className={`${styles.news}`}>
      <div className="flex items-center bg-white justify-center w-full">
        <div className="py-32 w-full">
          <ScrollIn>
            <p className="text-black font-bold text-3xl md:mb-16 text-center">
              NEWS
            </p>
          </ScrollIn>
          <div className="md:px-64">
            <ScrollIn>
              <div className="flex flex-wrap items-center p-8 md:mb-16">
                <div className="flex w-full md:w-1/2 justify-end items-center">
                  <div className="w-full">
                    <p className="text-green-500 font-bold text-xl mb-4">
                      2022.04.22
                    </p>
                    <p className="font-bold break-words mb-4">
                      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    </p>
                  </div>
                </div>
                <div className="flex w-full md:w-1/2 justify-center md:justify-start items-center">
                  <div className="mx-4 md:mx-0 md:ml-16 rounded-lg overflow-hidden">
                    <img
                      src="/images/dummy_480x320.png"
                      width="100%"
                      className="zoom"
                    />
                  </div>
                </div>
              </div>
            </ScrollIn>
            <ScrollIn>
              <div className="bg-gray-300 flex-none h-px"></div>
              <div className="flex flex-wrap items-center p-8 md:mb-16">
                <div className="flex w-full md:w-1/2 justify-end items-center">
                  <div className="w-full">
                    <p className="text-green-500 font-bold text-xl mb-4">
                      2022.04.22
                    </p>
                    <p className="font-bold break-words mb-4">
                      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    </p>
                  </div>
                </div>
                <div className="flex w-full md:w-1/2 justify-center md:justify-start items-center">
                  <div className="mx-4 md:mx-0 md:ml-16 rounded-lg overflow-hidden">
                    <img
                      src="/images/dummy_480x320.png"
                      width="100%"
                      className="zoom"
                    />
                  </div>
                </div>
              </div>
            </ScrollIn>
            <div className="mb-36"></div>
          </div>
        </div>
      </div>
    </section>
  </>
)

/** Container Component */
const NewsContainer: React.FC<ContainerProps<NewsProps, PresenterProps>> = ({
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

export default connect<NewsProps, PresenterProps>(
  'News',
  NewsPresenter,
  NewsContainer
)
