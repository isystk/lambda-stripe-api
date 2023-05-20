import React from 'react'
import renderer from 'react-test-renderer'
import ErrorTemplate, { ErrorTemplateProps } from './index'

describe('ErrorTemplate', () => {
  it('Match Snapshot', () => {
    const props: ErrorTemplateProps = { statusCode: 404 }
    const component = renderer.create(<ErrorTemplate {...props} />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
