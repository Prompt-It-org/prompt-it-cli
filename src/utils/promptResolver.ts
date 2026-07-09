import { applyPatch } from 'diff'
import { supabase } from '../services/supabase.js'
import { compareSemver } from './semver.js'

export type SupabasePrompt = {
  id: string
  owner_id: string
  name: string
  title: string
  description: string
  username: string
  current_content: string
  current_version: string
  tags: string[]
}

export type PromptVersionRecord = {
  version: string
  base_version: string | null
  change_type: 'snapshot' | 'diff'
  diff: string | null
  snapshot_content: string | null
  created_at: string
}

export type ResolvedPrompt = SupabasePrompt & {
  resolved_content: string
  resolved_version: string
  is_historical_version: boolean
}

export async function resolvePromptVersion(
  prompt: SupabasePrompt,
  requestedVersion?: string
): Promise<ResolvedPrompt> {
  if (!requestedVersion || requestedVersion === prompt.current_version) {
    return {
      ...prompt,
      resolved_content: prompt.current_content,
      resolved_version: prompt.current_version,
      is_historical_version: false
    }
  }

  const versionContent = await getPromptContentByVersion(prompt.id, requestedVersion)

  return {
    ...prompt,
    resolved_content: versionContent,
    resolved_version: requestedVersion,
    is_historical_version: true
  }
}

export async function getPromptContentByVersion(
  promptId: string,
  requestedVersion: string
): Promise<string> {
  const { data, error } = await supabase
    .from('prompt_versions')
    .select('version, base_version, change_type, diff, snapshot_content, created_at')
    .eq('prompt_id', promptId)

  if (error) {
    throw new Error(`Could not fetch prompt versions: ${error.message}`)
  }

  const versions = (data ?? []) as PromptVersionRecord[]

  if (versions.length === 0) {
    throw new Error('No version history found for this prompt.')
  }

  const requestedVersionRecord = versions.find((version) => version.version === requestedVersion)

  if (!requestedVersionRecord) {
    throw new Error(`Version not found: ${requestedVersion}`)
  }

  if (
    requestedVersionRecord.change_type === 'snapshot' &&
    requestedVersionRecord.snapshot_content
  ) {
    return requestedVersionRecord.snapshot_content
  }

  const sortedVersions = versions
    .filter((version) => compareSemver(version.version, requestedVersion) <= 0)
    .sort((a, b) => compareSemver(a.version, b.version))

  const requestedIndex = sortedVersions.findIndex((version) => version.version === requestedVersion)

  if (requestedIndex === -1) {
    throw new Error(`Version not found: ${requestedVersion}`)
  }

  let snapshotIndex = -1

  for (let index = requestedIndex; index >= 0; index--) {
    const version = sortedVersions[index]

    if (version.change_type === 'snapshot' && version.snapshot_content) {
      snapshotIndex = index
      break
    }
  }

  if (snapshotIndex === -1) {
    throw new Error(
      `Could not reconstruct version ${requestedVersion}. No snapshot found before it.`
    )
  }

  let content = sortedVersions[snapshotIndex].snapshot_content

  if (!content) {
    throw new Error(
      `Could not reconstruct version ${requestedVersion}. Snapshot content is missing.`
    )
  }

  for (let index = snapshotIndex + 1; index <= requestedIndex; index++) {
    const version = sortedVersions[index]

    if (version.change_type === 'snapshot') {
      if (!version.snapshot_content) {
        throw new Error(`Snapshot content is missing for version ${version.version}.`)
      }

      content = version.snapshot_content
      continue
    }

    if (!version.diff) {
      throw new Error(`Diff content is missing for version ${version.version}.`)
    }

    const patchedContent = applyPatch(content, version.diff)

    if (patchedContent === false) {
      throw new Error(`Could not apply diff for version ${version.version}.`)
    }

    content = patchedContent
  }

  return content
}

