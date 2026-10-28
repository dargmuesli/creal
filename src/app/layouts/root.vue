<template>
  <div class="relative">
    <div
      class="bg-creal absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
    />
    <div class="absolute inset-0 -z-10 bg-gray-800 opacity-75"></div>
    <div :class="{ 'lg:pr-96': store.playerData.isVisible }">
      <div class="container mx-auto p-4 md:px-8">
        <CrLayoutHeader />
        <div class="flex min-h-screen flex-col pb-32">
          <main class="flex flex-1">
            <slot />
          </main>
        </div>
        <CrLayoutFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// The player is a persistent sibling of the layout (see app.vue). The bottom
// padding stays at all breakpoints so the root hero stays centered; on lg the
// player is a right sidebar (container pr-96), so it never overlaps it.
const store = useStore()
</script>
