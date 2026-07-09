export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(username)
}

export function isValidPromptName(name: string): boolean {
  return /^[a-zA-Z0-9_-]{3,60}$/.test(name)
}

