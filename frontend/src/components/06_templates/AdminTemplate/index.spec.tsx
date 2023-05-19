import React from 'react'
import renderer from 'react-test-renderer'
import AdminTemplate, { AdminTemplateProps } from './index'

import MainService from '@/services/main'
import { Provider } from 'react-redux'
import { store } from '@/stores'

describe('AdminTemplate', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))
    const props: { main: MainService } = { main }
    const component = renderer.create(
      <Provider store={store}>
        <AdminTemplate {...props} />
      </Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
