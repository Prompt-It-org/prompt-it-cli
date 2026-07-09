import { describe, it, expect } from 'vitest'
import { normalizeTags } from '../src/utils/promptDetails.js'

describe('normalizeTags', () => {
  it('splits comma-separated string into array', () => {
    expect(normalizeTags('code,review,ai')).toEqual(['code', 'review', 'ai'])
  })

  it('trims whitespace around tags', () => {
    expect(normalizeTags('code , review , ai')).toEqual(['code', 'review', 'ai'])
  })

  it('handles single tag string', () => {
    expect(normalizeTags('code')).toEqual(['code'])
  })

  it('returns empty array for undefined', () => {
    expect(normalizeTags(undefined)).toEqual([])
  })

  it('returns array input as-is', () => {
    expect(normalizeTags(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('returns empty array for empty string', () => {
    expect(normalizeTags('')).toEqual([])
  })

  it('filters out empty strings from split result', () => {
    expect(normalizeTags('code,,review,')).toEqual(['code', 'review'])
  })

  it('handles tags with extra whitespace and empty entries', () => {
    expect(normalizeTags('  code  ,  ,  review  ,  ')).toEqual(['code', 'review'])
  })
})
