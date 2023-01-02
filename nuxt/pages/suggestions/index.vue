<template>
  <div class="flex-1">
    <LayoutBreadcrumbs>
      {{ title }}
    </LayoutBreadcrumbs>
    <Form
      :errors="api.errors"
      :form="v$"
      :is-form-sent="isFormSent"
      @submit.prevent="submit"
    >
      <FormInput
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
          <FormInputStateError
            :form-input="v$.artist"
            validation-property="maxLength"
          >
            {{ t('globalValidationLength') }}
          </FormInputStateError>
          <FormInputStateError
            :form-input="v$.artist"
            validation-property="required"
          >
            {{ t('globalValidationRequired') }}
          </FormInputStateError>
          <slot name="inputError" />
        </template>
      </FormInput>
      <FormInput
        id-label="input-title"
        is-required
        :placeholder="t('titlePlaceholder')"
        :title="t('title')"
        type="text"
        :value="v$.title"
        @input="form.title = $event"
      >
        <template #inputError>
          <FormInputStateError
            :form-input="v$.title"
            validation-property="maxLength"
          >
            {{ t('globalValidationLength') }}
          </FormInputStateError>
          <FormInputStateError
            :form-input="v$.title"
            validation-property="required"
          >
            {{ t('globalValidationRequired') }}
          </FormInputStateError>
          <slot name="inputError" />
        </template>
      </FormInput>
      <!-- <FormInputUrl
        :form-input="v$.url"
        is-optional
        @input="form.url = $event"
      /> -->
      <FormInput
        is-optional
        id-label="input-comment"
        :title="t('comment')"
        type="textarea"
      >
        <textarea
          id="input-comment"
          v-model.trim="v$.comment.$model"
          class="form-input"
        />
        <template #inputError>
          <FormInputStateError
            :form-input="v$.comment"
            validation-property="maxLength"
          >
            {{ t('globalValidationLength') }}
          </FormInputStateError>
          <slot name="inputError" />
        </template>
      </FormInput>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { maxLength, required } from '@vuelidate/validators'
import consola from 'consola'

import { useCreateSuggestionMutation } from '~/gql/generated'

definePageMeta({ colorMode: 'dark' })

const { t } = useI18n()
const fireError = useFireError()
const createSuggestionMutation = useCreateSuggestionMutation()

// api data
const api = computed(() =>
  reactive({
    data: {},
    ...getApiMeta([createSuggestionMutation]),
  })
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
async function submit() {
  try {
    await formPreSubmit(api, v$, isFormSent)
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
useHeadDefault(title, {
  meta: [
    {
      hid: 'description',
      property: 'description',
      content: t('description'),
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: t('description'),
    },
  ],
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
