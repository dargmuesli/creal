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
      <img
        alt="DJ cReal"
        src="/assets/static/logos/creal.svg"
        width="700"
        height="700"
        style="position: absolute; opacity: 0.025; left: 100"
      />
      <div
        style="
          color: rgb(209 213 219);
          font-size: 40px;
          font-weight: 600;
          margin-top: 80px;
        "
      >
        {{ t('description') }}
      </div>
      <h1 style="font-size: 72px; line-height: 1; max-width: 600px">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  description: string
  title: string
}
withDefaults(defineProps<Props>(), {})

const { t } = useI18n()
</script>

<script lang="ts">
export default {
  name: 'OgImage',
}
</script>

<i18n lang="yaml">
de:
  description: DJ cReal
en:
  description: DJ cReal
</i18n>
