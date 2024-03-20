<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <VioForm
      :errors="api.errors"
      :form="v$"
      :is-form-sent="isFormSent"
      @submit.prevent="submit"
    >
      <VioFormInput
        :error="v$.artist.$error"
        id-label="input-artist"
        is-required
        :placeholder="t('artistPlaceholder')"
        :title="t('artist')"
        type="text"
        :value="v$.artist"
        @input="form.artist = $event"
      >
        <template #inputError>
          <VioFormInputStateError
            :form-input="v$.artist"
            validation-property="maxLength"
          >
            {{ t('globalValidationLength') }}
          </VioFormInputStateError>
          <VioFormInputStateError
            :form-input="v$.artist"
            validation-property="required"
          >
            {{ t('globalValidationRequired') }}
          </VioFormInputStateError>
          <slot name="inputError" />
        </template>
      </VioFormInput>
      <VioFormInput
        id-label="input-title"
        is-required
        :placeholder="t('titlePlaceholder')"
        :title="t('title')"
        type="text"
        :value="v$.title"
        @input="form.title = $event"
      >
        <template #inputError>
          <VioFormInputStateError
            :form-input="v$.title"
            validation-property="maxLength"
          >
            {{ t('globalValidationLength') }}
          </VioFormInputStateError>
          <VioFormInputStateError
            :form-input="v$.title"
            validation-property="required"
          >
            {{ t('globalValidationRequired') }}
          </VioFormInputStateError>
          <slot name="inputError" />
        </template>
      </VioFormInput>
      <!-- <VioFormInputUrl
        :form-input="v$.url"
        is-optional
        @input="form.url = $event"
      /> -->
      <VioFormInput
        is-optional
        id-label="input-comment"
        :title="t('comment')"
        type="textarea"
        :value="v$.comment"
      >
        <textarea
          :id="`vio-${
            runtimeConfig.public.vio.isInProduction ? 'prod' : 'dev'
          }-input-comment`"
          v-model.trim="v$.comment.$model"
          class="form-input"
        />
        <template #inputError>
          <VioFormInputStateError
            :form-input="v$.comment"
            validation-property="maxLength"
          >
            {{ t('globalValidationLength') }}
          </VioFormInputStateError>
          <slot name="inputError" />
        </template>
      </VioFormInput>
    </VioForm>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { maxLength, required } from '@vuelidate/validators'
import { consola } from 'consola'

import { useCreateSuggestionMutation } from '~/gql/documents/mutations/suggestion/suggestionCreate'

const { t } = useI18n()
const fireError = useFireError()
const runtimeConfig = useRuntimeConfig()
const createSuggestionMutation = useCreateSuggestionMutation()

// api data
const api = computed(() =>
  reactive({
    data: {},
    ...getApiMeta([createSuggestionMutation]),
  }),
)

// data
const title = t('titlePage')
const form = reactive({
  artist: ref<string>(),
  comment: ref<string>(),
  title: ref<string>(),
  url: ref<string>(),
})
const isFormSent = ref(false)

// methods
const submit = async () => {
  try {
    await isFormValid({ v$, isFormSent })
  } catch (error) {
    consola.error(error)
    return
  }

  const result = await createSuggestionMutation.executeMutation({
    suggestionInput: {
      artist: form.artist || '',
      comment: form.comment,
      title: form.title || '',
    },
  })

  if (result.error) {
    fireError({ error: result.error }, api)
  }

  if (!result.data) return

  showToast({ title: t('submitSuccess') })

  form.artist = undefined
  form.comment = undefined
  form.title = undefined
  v$.value.$reset()
}

// vuelidate
const rules = {
  artist: {
    maxLength: maxLength(100),
    required,
  },
  comment: {
    maxLength: maxLength(250),
  },
  title: {
    maxLength: maxLength(100),
    required,
  },
  // url: {
  //   maxLength: maxLength(200),
  //   required,
  // },
}
const v$ = useVuelidate(rules, form)

// initialization
useHeadDefault({
  description: t('description'),
  title,
})
</script>

<script lang="ts">
export default {
  name: 'IndexPage',
}
</script>

<i18n lang="yaml">
de:
  artist: Künstler*in
  artistPlaceholder: Abba
  comment: Kommentar
  description: Schlage DJ cReal Lieder vor.
  submitSuccess: Erfolgreich eingereicht.
  title: Titel
  titlePage: Liedvorschläge
  titlePlaceholder: Dancing Queen
en:
  artist: Artist
  artistPlaceholder: Abba
  comment: Comment
  description: Suggest songs to DJ cReal.
  submitSuccess: Submitted successfully.
  title: Title
  titlePage: Song Suggestions
  titlePlaceholder: Dancing Queen
</i18n>
