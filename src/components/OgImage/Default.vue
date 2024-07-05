<template>
  <div
    style="
      background: rgb(31 41 55);
      color: rgb(249 250 251);
      display: flex;
      height: 100%;
      width: 100%;
    "
  >
    <img
      alt="DJ cReal"
      src="/assets/static/images/og.jpg"
      width="400"
      height="600"
    />
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 64px;
      "
    >
      <div style="display: flex; align-items: center">
        <h1 style="font-size: 72px; line-height: 1">{{ title }}</h1>
        <img
          alt="DJ cReal"
          src="/assets/static/logos/creal.svg"
          width="100"
          height="100"
        />
      </div>
      <div
        style="
          color: rgb(209 213 219);
          font-size: 30px;
          line-height: 36px;
          margin-top: 64px;
        "
      >
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  description: string
  title: string
}
withDefaults(defineProps<Props>(), {})
</script>

<script lang="ts">
export default {
  name: 'OgImage',
}
</script>
