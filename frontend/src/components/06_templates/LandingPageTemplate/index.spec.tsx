import React from 'react'
import renderer from 'react-test-renderer'
import LandingPageTemplate, { LandingPageTemplateProps } from './index'

import MainService from '@/services/main'
import { Provider } from 'react-redux'
import { store } from '@/stores'

describe('LandingPageTemplate', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))
    const props: LandingPageTemplateProps = { main }
    const component = renderer.create(
      <Provider store={store}>
        <LandingPageTemplate {...props} />
      </Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
