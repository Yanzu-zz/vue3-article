import { assert } from 'chai'
import { ImageProps } from '@/types'
import { generateFitUrl, CheckCondition, beforeUploadCheck, arrToObj, objToArr } from '@/helper'

describe('Helper unit test', () => {
  it('generateFitUrl', () => {
    const img: ImageProps = {
      _id: '1',
      url: 'www.img.com/123'
    }
    generateFitUrl(img, 50, 50)
    assert.equal('www.img.com/123?x-oss-process=image/resize,m_pad,h_50,w_50', img.fitUrl)

    generateFitUrl(img, 60, 87, ['g_pad'])
    assert.equal('www.img.com/123?x-oss-process=image/resize,g_pad,h_87,w_60', img.fitUrl)
  })

  it('beforeFileCheck', () => {
    // group 1
    const file1: File = new File(['This is a bbb'], 'a.txt', {
      type: 'plain/text'
    })
    const testCondition1: CheckCondition = {
      format: ['plain/text'],
      size: 2
    }
    const { passed: passed1, error: error1 } = beforeUploadCheck(file1, testCondition1)
    assert.equal(true, passed1)
    assert.equal(null, error1)

    // group 2
    const file2: File = new File(['This saidhfksjadf is a bbb'], 'b.txt', {
      type: 'image/png'
    })
    const testCondition2: CheckCondition = {
      format: ['plain/text'],
      size: 1
    }
    const { passed: passed2, error: error2 } = beforeUploadCheck(file2, testCondition2)
    assert.equal(false, passed2)
    assert.equal('format', error2)

    // group 3
    const file3: File = new File(['This saidhfksjsdmgnskjgbkasdbjfbkjsldbfnasmd flbsadfadf is a bbb'], 'c.txt', {
      type: 'image/png'
    })
    const testCondition3: CheckCondition = {
      format: ['image/png'],
      size: 0.0000000000001
    }
    const { passed: passed3, error: error3 } = beforeUploadCheck(file3, testCondition3)
    assert.equal(false, passed3)
    assert.equal('size', error3)
  })

  // The mutual transformation between Array and Object
  it('Array <==> Object', () => {
    interface TestProps {
      _id: string
      name: string
    }
    const testData: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]
    const res1 = arrToObj(testData)
    Object.keys(res1).forEach((item, index) => {
      assert.equal(index + 1 + '', res1[item]._id)
    })

    const testData2: { [key: string]: TestProps } = {
      1: { _id: '1', name: 'a' },
      2: { _id: '2', name: 'b' }
    }
    const res2 = objToArr(testData2)
    res2.forEach((item, index) => {
      assert.equal(index + 1 + '', item._id)
    })
  })
})
