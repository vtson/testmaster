<script setup lang="ts">
import * as MSData from '@/lib/master-strike-data/dist'
import { getIconUrl } from '@/services/iconMap'

/**
 * Renders a card description from the Description type.
 * Description = (DescriptionGroup | BulletPointDescription | DescriptionPiece)[]
 * DescriptionPiece = string | { bold } | { italic } | { icon } | { keyword } | { rule } | { hc } | { team } | { divider }
 */
defineProps<{
  description: any[]
  compact?: boolean
}>()

const { Metadata } = MSData

// Build lookup maps for O(1) access
const keywordMap = new Map<number, string>()
for (const kw of Metadata.keywordsArray) {
  if (kw.id > 0) keywordMap.set(kw.id, kw.label)
}

const ruleMap = new Map<number, string>()
for (const r of Metadata.rulesArray) {
  if (r.id > 0) ruleMap.set(r.id, r.label)
}

const teamMap = new Map<number, { label: string; value: string }>()
for (const t of Metadata.teamsArray) {
  teamMap.set(t.id, { label: t.label, value: t.value })
}

const hcMap = new Map<number, { label: string; value: string }>()
for (const hc of Metadata.heroClassesArray) {
  hcMap.set(hc.id, { label: hc.label, value: hc.value })
}

const iconMetaMap = new Map<number, { label: string; value: string }>()
for (const ic of Metadata.iconsArray) {
  iconMetaMap.set(ic.id, { label: ic.label, value: ic.value })
}

function renderPiece(piece: any): string {
  if (typeof piece === 'string') return piece
  if (piece.bold) return `<strong>${piece.bold}</strong>`
  if (piece.italic) return `<em>${piece.italic}</em>`

  if (piece.keyword !== undefined) {
    const label = keywordMap.get(piece.keyword) || piece.text || 'Keyword'
    return `<strong class="text-blue-600">${label}</strong>`
  }

  if (piece.rule !== undefined) {
    const label = ruleMap.get(piece.rule) || piece.text || 'Rule'
    return `<strong class="text-purple-600">${label}</strong>`
  }

  if (piece.hc !== undefined) {
    const hc = hcMap.get(piece.hc)
    if (hc) {
      const iconUrl = getIconUrl(hc.value)
      if (iconUrl) return `<img src="${iconUrl}" class="inline-block w-5 h-5 relative top-[1px] scale-[1.5] align-text-bottom" alt="${hc.label}" title="${hc.label}" />`
      return `<span class="text-indigo-600 font-semibold">${hc.label}</span>`
    }
    return `<span class="text-indigo-600">[HC${piece.hc}]</span>`
  }

  if (piece.team !== undefined) {
    const team = teamMap.get(piece.team)
    if (team) {
      // Try team-specific key first (for values that conflict with set names like 'shield', 'champions')
      const iconUrl = getIconUrl(team.value + '-team') || getIconUrl(team.value)
      if (iconUrl) return `<img src="${iconUrl}" class="inline-block w-5 h-5 relative top-[1px] scale-[1.5] align-text-bottom" alt="${team.label}" title="${team.label}" />`
      return `<span class="text-teal-600 font-semibold">${team.label}</span>`
    }
    return `<span class="text-teal-600">[Team${piece.team}]</span>`
  }

  if (piece.icon !== undefined) {
    const ic = iconMetaMap.get(piece.icon)
    if (ic) {
      const iconUrl = getIconUrl(ic.value)
      if (iconUrl) return `<img src="${iconUrl}" class="inline-block w-5 h-5 relative top-[1px] scale-[1.5] align-text-bottom" alt="${ic.label}" title="${ic.label}" />`
      return `<span class="text-amber-600 font-semibold">${ic.label}</span>`
    }
    return `<span class="text-amber-600">[★]</span>`
  }

  if (piece.divider) return '<hr class="my-1 border-gray-200"/>'
  return ''
}

function renderGroup(group: any): string {
  if (Array.isArray(group)) {
    return group.map(renderPiece).join(' ')
  }
  return renderPiece(group)
}

function renderDescription(desc: any[]): { lines: string[], bullets: string[] } {
  const lines: string[] = []
  const bullets: string[] = []

  for (const item of desc) {
    if (item && item.points) {
      // BulletPointDescription
      for (const point of item.points) {
        bullets.push(renderGroup(point))
      }
    } else if (Array.isArray(item)) {
      // DescriptionGroup
      lines.push(item.map(renderPiece).join(' '))
    } else {
      // Single DescriptionPiece
      lines.push(renderPiece(item))
    }
  }

  return { lines, bullets }
}
</script>

<template>
  <div v-if="description && description.length > 0" :class="compact ? 'text-[11px]' : 'text-sm'">
    <template v-for="(item, i) in renderDescription(description).lines" :key="'l'+i">
      <p v-if="item" class="text-slate-600 leading-relaxed" :class="compact ? 'mb-0.5' : 'mb-1'" v-html="item"></p>
    </template>
    <ul v-if="renderDescription(description).bullets.length > 0" :class="compact ? 'mt-0.5 space-y-0.5' : 'mt-1.5 space-y-1'" class="list-disc pl-4">
      <li
        v-for="(bullet, j) in renderDescription(description).bullets"
        :key="'b'+j"
        class="text-slate-600 leading-relaxed"
        v-html="bullet"
      ></li>
    </ul>
  </div>
</template>
