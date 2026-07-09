import { describe, it, expect } from 'vitest'
import { parsePromptRef } from '../src/utils/promptRef.js'

describe('parsePromptRef', () => {
  describe('valid references', () => {
    it('parses user/prompt-name without version', () => {
      const result = parsePromptRef('miguel/my-prompt')

      expect(result).toEqual({
        user: 'miguel',
        promptName: 'my-prompt'
      })
      expect(result.version).toBeUndefined()
    })

    it('parses user/prompt-name@version', () => {
      const result = parsePromptRef('miguel/my-prompt@1.0.0')

      expect(result).toEqual({
        user: 'miguel',
        promptName: 'my-prompt',
        version: '1.0.0'
      })
    })

    it('parses version with high numbers', () => {
      const result = parsePromptRef('user/prompt@10.20.30')

      expect(result).toEqual({
        user: 'user',
        promptName: 'prompt',
        version: '10.20.30'
      })
    })

    it('handles prompt names with hyphens and underscores', () => {
      const result = parsePromptRef('user/my_cool-prompt@1.0.0')

      expect(result).toEqual({
        user: 'user',
        promptName: 'my_cool-prompt',
        version: '1.0.0'
      })
    })

    it('handles usernames with hyphens and underscores', () => {
      const result = parsePromptRef('cool-user_01/prompt')

      expect(result).toEqual({
        user: 'cool-user_01',
        promptName: 'prompt'
      })
    })
  })

  describe('invalid references', () => {
    it('throws on empty string', () => {
      expect(() => parsePromptRef('')).toThrow('Prompt reference is required.')
    })

    it('throws on non-string input', () => {
      // @ts-expect-error testing runtime behavior with wrong type
      expect(() => parsePromptRef(null)).toThrow('Prompt reference is required.')
      // @ts-expect-error testing runtime behavior with wrong type
      expect(() => parsePromptRef(undefined)).toThrow('Prompt reference is required.')
    })

    it('throws on missing slash separator', () => {
      expect(() => parsePromptRef('no-slash-here')).toThrow('Invalid prompt reference')
    })

    it('throws on too many slashes', () => {
      expect(() => parsePromptRef('a/b/c')).toThrow('Invalid prompt reference')
    })

    it('throws on empty user part', () => {
      expect(() => parsePromptRef('/prompt-name')).toThrow('Invalid prompt reference')
    })

    it('throws on empty prompt part', () => {
      expect(() => parsePromptRef('user/')).toThrow('Invalid prompt reference')
    })

    it('throws on empty prompt name before @version', () => {
      expect(() => parsePromptRef('user/@1.0.0')).toThrow('Prompt name is required before @version')
    })

    it('throws on empty version after @', () => {
      expect(() => parsePromptRef('user/prompt@')).toThrow('Version is required after @')
    })

    it('throws on invalid semver version', () => {
      expect(() => parsePromptRef('user/prompt@abc')).toThrow('Invalid version')
    })

    it('throws on partial semver', () => {
      expect(() => parsePromptRef('user/prompt@1.0')).toThrow('Invalid version')
    })

    it('throws on semver with extra parts', () => {
      expect(() => parsePromptRef('user/prompt@1.0.0.0')).toThrow('Invalid version')
    })
  })
})
