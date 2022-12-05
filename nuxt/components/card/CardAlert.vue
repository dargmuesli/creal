<template>
  <div
    v-if="$slots.default || errorMessage"
    class="card dark:card-dark overflow-hidden border-0 bg-red-600 text-center font-medium text-white"
    :class="{ 'rounded-none': isEdgy }"
    role="alert"
  >
    <span v-if="errorMessage">
      {{ t('error', { errorMessage }) }}
    </span>
    <slot />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    errorMessage: {
      default: undefined,
      type: String as PropType<string | undefined>,
    },
    isEdgy: {
      default: false,
      type: Boolean,
    },
  },
})
</script>

<i18n lang="yaml">
de:
  error: 'Fehler: {errorMessage}'
en:
  error: 'Error: {errorMessage}'
</i18n>
