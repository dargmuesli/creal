<template>
  <div class="relative">
    <div
      class="bg-creal absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
    />
    <div class="absolute inset-0 -z-10 bg-gray-800 opacity-75"></div>
    <div class="container mx-auto p-4 md:px-8">
      <LayoutHeader />
      <div class="flex min-h-screen flex-col pb-32">
        <main class="flex flex-1">
          <slot />
        </main>
      </div>
      <LayoutFooter />
    </div>
  </div>
</template>
