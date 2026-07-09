export type Semver = {
  major: number
  minor: number
  patch: number
}

export function parseSemver(version: string): Semver | null {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/)

  if (!match) {
    return null
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

export function isValidSemver(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version)
}

export function compareSemver(a: string, b: string): number {
  const versionA = parseSemver(a)
  const versionB = parseSemver(b)

  if (!versionA || !versionB) {
    throw new Error('Invalid semantic version found in version history.')
  }

  if (versionA.major !== versionB.major) {
    return versionA.major - versionB.major
  }

  if (versionA.minor !== versionB.minor) {
    return versionA.minor - versionB.minor
  }

  return versionA.patch - versionB.patch
}

export function isVersionGreater(newVersion: string, currentVersion: string): boolean {
  const current = parseSemver(currentVersion)
  const next = parseSemver(newVersion)

  if (!current || !next) {
    return false
  }

  if (next.major !== current.major) {
    return next.major > current.major
  }

  if (next.minor !== current.minor) {
    return next.minor > current.minor
  }

  return next.patch > current.patch
}

export function getChangeType(
  currentVersion: string,
  newVersion: string
): 'snapshot' | 'diff' {
  const current = parseSemver(currentVersion)
  const next = parseSemver(newVersion)

  if (!current || !next) {
    return 'snapshot'
  }

  const isPatchOnly =
    current.major === next.major && current.minor === next.minor && next.patch > current.patch

  return isPatchOnly ? 'diff' : 'snapshot'
}
