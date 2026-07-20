<template>
  <div class="flex bg-gray-800 text-gray-50">
    <img
      alt="DJ cReal"
      class="object-cover"
      src="/assets/static/images/og.jpg"
      width="400"
      height="630"
    />
    <div class="ml-16 flex flex-col justify-center">
      <img
        alt="DJ cReal"
        class="absolute left-25 opacity-[0.025]"
        src="/assets/static/logos/creal.svg"
        width="700"
        height="700"
      />
      <div
        class="mt-20 text-[40px] font-semibold text-gray-300"
        :style="headlineLineClamp"
      >
        {{ headline }}
      </div>
      <h1 class="text-[72px] font-bold" :style="titleLineClamp">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue'

const { headline, title } = defineProps<{
  headline: string
  title: string
}>()

const lineClampStyle: (value: string, maxLines: number) => StyleValue = (
  value: string,
  maxLines: number,
) => {
  if (!value)
    return {
      display: 'block',
      'text-overflow': 'ellipsis',
    }

  const wordCount = value.trim().split(/\s+/).length
  return {
    display: 'block',
    'line-clamp': Math.min(wordCount, maxLines),
    'text-overflow': 'ellipsis',
  }
}

const headlineLineClamp = lineClampStyle(headline, 1)
const titleLineClamp = lineClampStyle(title, 2)
</script>
