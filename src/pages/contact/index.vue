<template>
  <div class="flex-1">
    <VioCardStateInfo v-if="isFormSent" class="flex flex-col gap-2">
      <span class="text-xl font-bold">
        {{ t('thankYouTitle') }}
      </span>
      <span>
        {{ t('thankYouBody') }}
      </span>
    </VioCardStateInfo>
    <section v-else>
      <h1>{{ t('title') }}</h1>
      <FormContact @submit="submit" />
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const fireError = useFireError()
const backendFetch = useServiceFetch({
  name: 'backend',
})
const siteConfig = useSiteConfig()

// data
const isFormSent = ref(false)

// methods
const submit = async (body: object) => {
  try {
    await backendFetch('/api/contact', {
      method: 'POST',
      body: { ...body, siteName: siteConfig.name },
    })

    isFormSent.value = true
  } catch (error: unknown) {
    if (error instanceof Error) {
      fireError({
        // level: 'error',
        error,
        // text: t('iCalFetchError'),
      })
    } else {
      alert(`Unexpected error: ${error}`)
    }
  }
}

// initialization
useHeadDefault({ title: t('title') })
</script>

<i18n lang="yaml">
de:
  thankYouBody: Deine Nachricht wurde versendet. Ich werde mich in Kürze bei dir melden.
  thankYouTitle: Danke!
  title: Kontakt
en:
  thankYouBody: Your message has been sent. I'll get back to you shortly.
  thankYouTitle: Thank you!
  title: Contact
</i18n>
