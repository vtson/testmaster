<script setup lang="ts">
/**
 * Renders a card description from the Description type.
 * Description = (DescriptionGroup | BulletPointDescription | DescriptionPiece)[]
 * DescriptionPiece = string | { bold } | { italic } | { icon } | { keyword } | { rule } | { hc } | { team } | { divider }
 */
defineProps<{
  description: any[]
  compact?: boolean
}>()

function renderPiece(piece: any): string {
  if (typeof piece === 'string') return piece
  if (piece.bold) return `<strong>${piece.bold}</strong>`
  if (piece.italic) return `<em>${piece.italic}</em>`
  if (piece.keyword !== undefined) return `<strong class="text-blue-600">${piece.text || 'Keyword'}</strong>`
  if (piece.rule !== undefined) return `<strong class="text-purple-600">${piece.text || 'Rule'}</strong>`
  if (piece.hc !== undefined) return `<span class="text-indigo-600">[HC${piece.hc}]</span>`
  if (piece.team !== undefined) return `<span class="text-teal-600">[Team${piece.team}]</span>`
  if (piece.icon !== undefined) return `<span class="text-amber-600">[★]</span>`
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
