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
      <i18n-t
        class="mb-8 text-center text-gray-300"
        keypath="riderHint"
        tag="p"
      >
        <template #rider>
          <VioLink :to="localePath({ path: '/rider' })">{{
            t('rider')
          }}</VioLink>
        </template>
      </i18n-t>
      <VioFormContact :is-loading="isFormSubmitting" @submit="submit" />
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const alertError = useAlertError()
const localePath = useLocalePath()
const backendFetch = useServiceFetch({
  name: 'backend',
})
const siteConfig = useSiteConfig()

// form
const isFormSent = ref<boolean>()
const isFormSubmitting = ref<boolean>()
const submit = async (body: object) => {
  try {
    isFormSubmitting.value = true

    await backendFetch('/api/contact', {
      method: 'POST',
      body: { ...body, siteName: siteConfig.name },
    })

    isFormSent.value = true
  } catch (error: unknown) {
    alertError({
      ...(error instanceof Error ? { error } : {}),
      messageI18n: t('fetchError'),
    })
  }

  isFormSubmitting.value = false
}

// leave protection
// Warn before the page goes away (close, reload, navigate) while the form
// has input, so a started message isn't lost. The check happens on leave,
// so no input state has to be tracked; hidden inputs (e.g. the static form
// name) don't count as input.
const hasFormInput = () =>
  [
    ...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'form input, form textarea',
    ),
  ].some((input) => input.type !== 'hidden' && input.value.trim() !== '')
const onBeforeUnload = (event: BeforeUnloadEvent) => {
  if (isFormSent.value || !hasFormInput()) return

  event.preventDefault()
  // Also required: Chrome ignores preventDefault alone.
  event.returnValue = ''
}
// beforeunload covers reload and close; client-side navigation (header
// links, etc.) unmounts the page without it, so route away needs its own
// guard.
onBeforeRouteLeave(() => {
  if (isFormSent.value || !hasFormInput()) return

  return window.confirm(t('leaveConfirm'))
})

// lifecycle
onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
onBeforeUnmount(() =>
  window.removeEventListener('beforeunload', onBeforeUnload),
)

// initialization
useCrealHeadDefault({ title: t('title') })
</script>

<i18n lang="yaml">
de:
  fetchError: Es gab einen Fehler beim Versenden der Nachricht
  leaveConfirm: Deine Nachricht wurde noch nicht gesendet. Die Seite trotzdem verlassen?
  rider: technischen Rider
  riderHint: Die technischen Anforderungen für eine Buchung findest du im {rider}.
  thankYouBody: Deine Nachricht wurde versendet. Ich werde mich in Kürze bei dir melden.
  thankYouTitle: Danke!
  title: Kontakt
en:
  fetchError: There was an error sending the message
  leaveConfirm: Your message hasn't been sent yet. Leave the page anyway?
  rider: technical rider
  riderHint: You can find the technical requirements for a booking in the {rider}.
  thankYouBody: Your message has been sent. I'll get back to you shortly.
  thankYouTitle: Thank you!
  title: Contact
</i18n>
