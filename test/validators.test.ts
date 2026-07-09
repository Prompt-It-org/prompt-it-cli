import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidUsername, isValidPromptName } from '../src/utils/validators.js'

describe('isValidEmail', () => {
  it('accepts valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('test.user@domain.co')).toBe(true)
    expect(isValidEmail('name+tag@email.org')).toBe(true)
    expect(isValidEmail('user123@test.io')).toBe(true)
  })

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('rejects missing @ symbol', () => {
    expect(isValidEmail('no-at-sign')).toBe(false)
  })

  it('rejects missing user part', () => {
    expect(isValidEmail('@domain.com')).toBe(false)
  })

  it('rejects missing domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('rejects spaces in email', () => {
    expect(isValidEmail('user name@email.com')).toBe(false)
    expect(isValidEmail('user@email domain.com')).toBe(false)
  })
})

describe('isValidUsername', () => {
  it('accepts valid usernames (3-30 chars, alphanumeric + _ -)', () => {
    expect(isValidUsername('miguel')).toBe(true)
    expect(isValidUsername('user_name')).toBe(true)
    expect(isValidUsername('user-name')).toBe(true)
    expect(isValidUsername('user_name-01')).toBe(true)
    expect(isValidUsername('abc')).toBe(true) // minimum 3 chars
  })

  it('accepts username at max length (30 chars)', () => {
    expect(isValidUsername('a'.repeat(30))).toBe(true)
  })

  it('rejects too short usernames (< 3 chars)', () => {
    expect(isValidUsername('ab')).toBe(false)
    expect(isValidUsername('a')).toBe(false)
    expect(isValidUsername('')).toBe(false)
  })

  it('rejects too long usernames (> 30 chars)', () => {
    expect(isValidUsername('a'.repeat(31))).toBe(false)
  })

  it('rejects usernames with special characters', () => {
    expect(isValidUsername('user name')).toBe(false)
    expect(isValidUsername('user@name')).toBe(false)
    expect(isValidUsername('user.name')).toBe(false)
    expect(isValidUsername('user!name')).toBe(false)
  })
})

describe('isValidPromptName', () => {
  it('accepts valid prompt names (3-60 chars, alphanumeric + _ -)', () => {
    expect(isValidPromptName('my-prompt')).toBe(true)
    expect(isValidPromptName('my_prompt')).toBe(true)
    expect(isValidPromptName('prompt123')).toBe(true)
    expect(isValidPromptName('abc')).toBe(true) // minimum 3 chars
  })

  it('accepts prompt name at max length (60 chars)', () => {
    expect(isValidPromptName('a'.repeat(60))).toBe(true)
  })

  it('rejects too short prompt names (< 3 chars)', () => {
    expect(isValidPromptName('ab')).toBe(false)
    expect(isValidPromptName('a')).toBe(false)
    expect(isValidPromptName('')).toBe(false)
  })

  it('rejects too long prompt names (> 60 chars)', () => {
    expect(isValidPromptName('a'.repeat(61))).toBe(false)
  })

  it('rejects prompt names with special characters', () => {
    expect(isValidPromptName('my prompt')).toBe(false)
    expect(isValidPromptName('my@prompt')).toBe(false)
    expect(isValidPromptName('my.prompt')).toBe(false)
    expect(isValidPromptName('my/prompt')).toBe(false)
  })
})
