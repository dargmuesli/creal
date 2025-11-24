<template>
  <div class="h-full w-full flex-row bg-gray-800 text-gray-50">
    <img
      alt="DJ cReal"
      src="/assets/static/images/og.jpg"
      width="400"
      height="600"
    />
    <div class="ml-16 justify-center">
      <img
        alt="DJ cReal"
        class="absolute left-[100px] opacity-[0.025]"
        src="/assets/static/logos/creal.svg"
        width="700"
        height="700"
      />
      <template v-if="title !== siteConfigName">
        <div class="mt-20 text-[40px] font-semibold text-gray-300">
          {{ siteConfigName }}
        </div>
        <h1 class="text-[72px] leading-none">
          {{ title }}
        </h1>
      </template>
      <template v-else>
        <div class="mt-20 text-[40px] font-semibold text-gray-300">
          {{ headline }}
        </div>
        <h1 class="text-[72px] leading-none">
          {{ name }}
        </h1>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  description: string
  headline: string
  name: string
  siteConfigName: string
  title: string
}
withDefaults(defineProps<Props>(), {})
</script>

<script lang="ts">
export default {
  name: 'OgImage',
}
</script>
