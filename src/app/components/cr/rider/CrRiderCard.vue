<template>
  <VioCard background-color="bg-gray-900" class="flex flex-col gap-4 lg:p-8">
    <div class="flex items-center gap-4">
      <component
        :is="icon"
        aria-hidden="true"
        class="size-8 shrink-0 text-yellow-500"
      />
      <component :is="headingTag">{{ heading }}</component>
    </div>
    <ul class="grid gap-4" :class="{ 'lg:grid-cols-3 lg:gap-x-8': isWide }">
      <li
        v-for="item in items"
        :key="item"
        class="border-l-2 border-gray-700 pl-4"
      >
        {{ item }}
      </li>
    </ul>
  </VioCard>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

const { headingTag = 'h2', isWide = false } = defineProps<{
  heading: string
  headingTag?: 'h2' | 'h3'
  icon: Component
  isWide?: boolean
  items: string[]
}>()
</script>
