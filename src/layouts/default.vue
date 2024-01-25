<template>
  <div class="container mx-auto p-4 md:px-8">
    <div class="flex min-h-screen flex-col pb-32">
      <LayoutHeader />
      <main class="flex flex-1 overflow-hidden">
        <slot />
      </main>
    </div>
    <LayoutFooter />
  </div>
</template>
