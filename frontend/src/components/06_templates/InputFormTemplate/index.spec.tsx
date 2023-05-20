import React from 'react'
import renderer from 'react-test-renderer'
import InputFormTemplate, { InputFormTemplateProps } from './index'

describe('InputFormTemplate', () => {
  it('Match Snapshot', () => {
    const props: InputFormTemplateProps = { title: 'サンプル' }
    const component = renderer.create(<InputFormTemplate {...props} />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
