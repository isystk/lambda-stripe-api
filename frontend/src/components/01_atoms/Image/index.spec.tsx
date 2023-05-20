import React from 'react'
import renderer from 'react-test-renderer'
import Image from './index'

describe('Image', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(
      <div className="w-64 rounded-lg overflow-hidden">
        <Image src="/images/dummy_480x320.png" className="zoom" alt="dummy" />
      </div>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
    expect(true)
  })
})
