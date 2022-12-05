<template>
  <div
    v-if="
      (!formInput && !validationProperty) ||
      (formInput.$error &&
        validationProperty in formInput &&
        !formInput[validationProperty])
    "
    class="flex items-center gap-1 text-left text-red-600"
  >
    <IconExclamationCircle
      v-if="formInput && validationProperty"
      classes="h-5 w-5"
    />
    <slot />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    formInput: {
      default: undefined,
      type: Object,
    },
    validationProperty: {
      default: undefined,
      type: String as PropType<string | undefined>,
    },
  },
})
</script>
