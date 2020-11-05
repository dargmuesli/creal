<template>
  <div class="container mx-auto px-4 text-center">
    <header class="flex items-center justify-center lg:justify-start my-4">
      <nuxt-link :to="'/'" class="flex items-center">
        <div id="logo" class="h-10 w-10" />
        <span class="font-bold text-lg"> cReal </span>
      </nuxt-link>
    </header>
    <nuxt />
  </div>
</template>

<style scoped>
#logo {
  background-image: url(/assets/static/logos/creal.svg);
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
