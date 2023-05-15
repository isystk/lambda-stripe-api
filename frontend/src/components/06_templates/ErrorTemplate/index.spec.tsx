import React from 'react'
import renderer from 'react-test-renderer'
import ErrorTemplate, { ErrorTemplateProps } from './index'

import MainService from '@/services/main'
import { Provider } from 'react-redux'
import { store } from '@/stores'

describe('ErrorTemplate', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))
    const props: ErrorTemplateProps = { main, statusCode: '404' }
    const component = renderer.create(
      <Provider store={store}>
        <ErrorTemplate {...props} />
      </Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
