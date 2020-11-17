import { assert } from 'chai'
import { ImageProps } from '@/types'
import { generateFitUrl } from '@/helper'

describe('Helper unit test', () => {
  it('should return true', () => {
    const img: ImageProps = {
      _id: '1',
      url: 'www.img.com/123'
    }
    generateFitUrl(img, 50, 50)
    assert.equal('www.img.com/123?x-oss-process=image/resize,m_pad,h_50,w_50', img.fitUrl)

    generateFitUrl(img, 60, 87, ['g_pad'])
    assert.equal('www.img.com/123?x-oss-process=image/resize,g_pad,h_87,w_60', img.fitUrl)
  })
})
