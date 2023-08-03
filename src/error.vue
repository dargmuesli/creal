<template>
  <NuxtLayout>
    <Error :status-code="error?.statusCode ? +error?.statusCode : undefined" />
  </NuxtLayout>
</template>

<script setup lang="ts">
export type Error = { statusCode: string }
export interface Props {
  error?: Error
}
const props = withDefaults(defineProps<Props>(), {
  error: undefined,
})
const errorProp = toRef(() => props.error)

useHead({
  title: errorProp.value?.statusCode?.toString(),
})
</script>
