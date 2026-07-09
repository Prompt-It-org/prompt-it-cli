import { describe, it, expect } from 'vitest'
import {
  parseSemver,
  isValidSemver,
  compareSemver,
  isVersionGreater,
  getChangeType
} from '../src/utils/semver.js'

describe('parseSemver', () => {
  it('parses valid semver strings', () => {
    expect(parseSemver('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 })
    expect(parseSemver('0.0.0')).toEqual({ major: 0, minor: 0, patch: 0 })
    expect(parseSemver('10.20.30')).toEqual({ major: 10, minor: 20, patch: 30 })
  })

  it('returns null for invalid semver', () => {
    expect(parseSemver('abc')).toBeNull()
    expect(parseSemver('1.2')).toBeNull()
    expect(parseSemver('1.2.3.4')).toBeNull()
    expect(parseSemver('')).toBeNull()
    expect(parseSemver('v1.0.0')).toBeNull()
    expect(parseSemver('1.0.0-beta')).toBeNull()
  })
})

describe('isValidSemver', () => {
  it('accepts valid semver strings', () => {
    expect(isValidSemver('1.0.0')).toBe(true)
    expect(isValidSemver('0.0.1')).toBe(true)
    expect(isValidSemver('99.99.99')).toBe(true)
  })

  it('rejects invalid semver strings', () => {
    expect(isValidSemver('abc')).toBe(false)
    expect(isValidSemver('1.0')).toBe(false)
    expect(isValidSemver('1')).toBe(false)
    expect(isValidSemver('')).toBe(false)
    expect(isValidSemver('1.0.0.0')).toBe(false)
    expect(isValidSemver('v1.0.0')).toBe(false)
  })
})

describe('compareSemver', () => {
  it('returns negative when a < b (major)', () => {
    expect(compareSemver('1.0.0', '2.0.0')).toBeLessThan(0)
  })

  it('returns negative when a < b (minor)', () => {
    expect(compareSemver('1.0.0', '1.1.0')).toBeLessThan(0)
  })

  it('returns negative when a < b (patch)', () => {
    expect(compareSemver('1.0.0', '1.0.1')).toBeLessThan(0)
  })

  it('returns 0 when versions are equal', () => {
    expect(compareSemver('1.0.0', '1.0.0')).toBe(0)
    expect(compareSemver('3.2.1', '3.2.1')).toBe(0)
  })

  it('returns positive when a > b', () => {
    expect(compareSemver('2.0.0', '1.0.0')).toBeGreaterThan(0)
    expect(compareSemver('1.1.0', '1.0.0')).toBeGreaterThan(0)
    expect(compareSemver('1.0.1', '1.0.0')).toBeGreaterThan(0)
  })

  it('throws on invalid versions', () => {
    expect(() => compareSemver('abc', '1.0.0')).toThrow('Invalid semantic version')
    expect(() => compareSemver('1.0.0', 'xyz')).toThrow('Invalid semantic version')
  })
})

describe('isVersionGreater', () => {
  it('returns true when new version is greater (major)', () => {
    expect(isVersionGreater('2.0.0', '1.0.0')).toBe(true)
  })

  it('returns true when new version is greater (minor)', () => {
    expect(isVersionGreater('1.1.0', '1.0.0')).toBe(true)
  })

  it('returns true when new version is greater (patch)', () => {
    expect(isVersionGreater('1.0.1', '1.0.0')).toBe(true)
  })

  it('returns false when versions are equal', () => {
    expect(isVersionGreater('1.0.0', '1.0.0')).toBe(false)
  })

  it('returns false when new version is lower', () => {
    expect(isVersionGreater('1.0.0', '2.0.0')).toBe(false)
    expect(isVersionGreater('1.0.0', '1.1.0')).toBe(false)
    expect(isVersionGreater('1.0.0', '1.0.1')).toBe(false)
  })

  it('returns false for invalid versions', () => {
    expect(isVersionGreater('abc', '1.0.0')).toBe(false)
    expect(isVersionGreater('1.0.0', 'abc')).toBe(false)
  })
})

describe('getChangeType', () => {
  it('returns "diff" for patch-only increments', () => {
    expect(getChangeType('1.0.0', '1.0.1')).toBe('diff')
    expect(getChangeType('1.0.1', '1.0.2')).toBe('diff')
    expect(getChangeType('2.3.0', '2.3.5')).toBe('diff')
  })

  it('returns "snapshot" for minor version bumps', () => {
    expect(getChangeType('1.0.0', '1.1.0')).toBe('snapshot')
    expect(getChangeType('1.0.5', '1.1.0')).toBe('snapshot')
  })

  it('returns "snapshot" for major version bumps', () => {
    expect(getChangeType('1.0.0', '2.0.0')).toBe('snapshot')
    expect(getChangeType('1.5.3', '2.0.0')).toBe('snapshot')
  })

  it('returns "snapshot" for invalid versions', () => {
    expect(getChangeType('abc', '1.0.0')).toBe('snapshot')
    expect(getChangeType('1.0.0', 'abc')).toBe('snapshot')
  })
})
