<template>
  <div class="text-center">
    <div class="my-4">{{ partString }}</div>
    <div class="inline-grid grid-cols-2">
      <VioButton
        :aria-label="t('previous')"
        :icon="false"
        :disabled="!isPreviousAllowed"
        :wrapper-class="'mx-2'"
        @click="goPrevious"
      >
        {{ t('previous') }}
      </VioButton>
      <VioButton
        :aria-label="t('next')"
        :icon="false"
        :disabled="!isNextAllowed"
        :wrapper-class="'mx-2'"
        @click="goNext"
      >
        {{ t('next') }}
      </VioButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isPreviousAllowed: boolean
  isNextAllowed: boolean
  partString: string
  queryPrevious: Record<any, any>
  queryNext: Record<any, any>
}
const props = withDefaults(defineProps<Props>(), {
  isPreviousAllowed: true,
  isNextAllowed: true,
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// methods
const goPrevious = () =>
  router.push({
    path: route.path,
    query: props.queryPrevious,
  })

const goNext = () =>
  router.push({
    path: route.path,
    query: props.queryNext,
  })
</script>

<i18n lang="yaml">
de:
  next: Weiter
  previous: Zurück
en:
  next: Next
  previous: Previous
</i18n>
