import React from 'react'
import renderer from 'react-test-renderer'
import AdminTemplate, { AdminTemplateProps } from './index'

import MainService from '@/services/main'

describe('AdminTemplate', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))
    const props: AdminTemplateProps = { main, title: 'サンプル' }
    const component = renderer.create(<AdminTemplate {...props} />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
