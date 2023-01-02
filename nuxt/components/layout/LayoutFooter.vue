<template>
  <footer class="text-sm leading-6">
    <div class="flex flex-col gap-8">
      <div class="flex items-center">
        <LayoutHr />
        <!-- alt="DJ cReals Logo" -->
        <IconLogo class="mx-12 h-12 w-12 brightness-0 opacity-60 invert" />
        <LayoutHr />
      </div>
      <!-- Justifying evenly, instead of "between", centers a single element. -->
      <div class="flex flex-wrap justify-evenly">
        <slot />
      </div>
      <p class="text-center text-gray-500 dark:text-gray-400">
        {{
          t('copyright', {
            name: 'Jonas Thelemann',
            year: new Date().getFullYear(),
          })
        }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<i18n lang="yaml">
de:
  copyright: © {year} {name}. Alle Rechte vorbehalten.
en:
  copyright: © {year} {name}. All rights reserved.
</i18n>
