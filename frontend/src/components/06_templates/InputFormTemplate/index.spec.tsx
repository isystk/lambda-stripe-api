import React from 'react'
import renderer from 'react-test-renderer'
import InputFormTemplate, { InputFormTemplateProps } from './index'

import MainService from '@/services/main'
import { Provider } from 'react-redux'
import { store } from '@/stores'

describe('InputFormTemplate', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))
    const props: InputFormTemplateProps = { main }
    const component = renderer.create(
      <Provider store={store}>
        <InputFormTemplate {...props} />
      </Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
