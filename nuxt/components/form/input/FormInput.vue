<template>
  <div class="my-6">
    <div
      :class="{
        'form-input-success': success,
        'form-input-warning': warning,
        'form-input-error': error,
      }"
      class="flex-wrap md:flex md:items-center"
    >
      <div class="mb-1 leading-snug md:mb-0 md:w-1/3 md:pr-4 md:text-right">
        <label
          class="flex items-baseline space-x-2 font-semibold md:flex-col md:items-end md:space-x-0"
          :class="{
            'text-green-600': success,
            'text-yellow-600': warning,
            'text-red-500': error,
          }"
          :for="labelFor"
        >
          <span>{{ title }}</span>
          <span class="text-xs font-medium text-gray-500 md:text-right">
            <span v-if="required">
              {{ t('required') }}
            </span>
            <span v-if="isOptional">
              {{ t('optional') }}
            </span>
          </span>
        </label>
      </div>
      <div class="text-black md:mt-1 md:w-2/3">
        <slot />
      </div>
      <div class="md:w-1/3" />
      <div class="md:w-2/3">
        <slot name="inputSuccess" />
      </div>
      <div class="md:w-1/3" />
      <div class="text-left text-sm text-gray-500 md:w-2/3">
        <slot name="inputInfo" />
      </div>
      <div class="md:w-1/3" />
      <div class="md:w-2/3">
        <slot name="inputWarning" />
      </div>
      <div class="md:w-1/3" />
      <div class="md:w-2/3">
        <slot name="inputError" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const FormInput = defineComponent({
  props: {
    error: {
      default: false,
      type: Boolean,
    },
    isOptional: {
      default: false,
      type: Boolean,
    },
    labelFor: {
      default: undefined,
      type: String as PropType<string | undefined>,
    },
    required: {
      default: false,
      type: Boolean,
    },
    success: {
      default: false,
      type: Boolean,
    },
    title: {
      default: undefined,
      type: String as PropType<string | undefined>,
    },
    warning: {
      default: false,
      type: Boolean,
    },
  },
})

export default FormInput

export type FormInputType = InstanceType<typeof FormInput>
</script>

<i18n lang="yaml">
de:
  optional: optional
  required: Pflichtfeld
en:
  optional: optional
  required: required
</i18n>
