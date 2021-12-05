<template>
  <section>
    <h1>{{ title }}</h1>
    <Form
      ref="form"
      :form="$v.form"
      :form-sent="form.sent"
      :graphql-error="graphqlError"
      @submit.prevent="submit"
    >
      <FormInput
        :error="$v.form.artist.$error"
        label-for="input-artist"
        required
        :title="$t('artist')"
      >
        <input
          id="input-artist"
          v-model.trim="$v.form.artist.$model"
          class="form-input"
          type="text"
          :placeholder="$t('artistPlaceholder')"
        />
        <template slot="inputError">
          <FormInputError
            :form-input="$v.form.artist"
            validation-property="maxLength"
          >
            {{ $t('globalValidationLength') }}
          </FormInputError>
          <FormInputError
            :form-input="$v.form.artist"
            validation-property="required"
          >
            {{ $t('globalValidationRequired') }}
          </FormInputError>
          <slot name="inputError" />
        </template>
      </FormInput>
      <FormInput
        :error="$v.form.title.$error"
        label-for="input-title"
        required
        :title="$t('title')"
      >
        <input
          id="input-title"
          v-model.trim="$v.form.title.$model"
          class="form-input"
          type="text"
          :placeholder="$t('titlePlaceholder')"
        />
        <template slot="inputError">
          <FormInputError
            :form-input="$v.form.title"
            validation-property="maxLength"
          >
            {{ $t('globalValidationLength') }}
          </FormInputError>
          <FormInputError
            :form-input="$v.form.title"
            validation-property="required"
          >
            {{ $t('globalValidationRequired') }}
          </FormInputError>
          <slot name="inputError" />
        </template>
      </FormInput>
      <!-- <FormInputUrl
        :form-input="$v.form.url"
        is-optional
        @input="form.url = $event"
      /> -->
      <FormInput
        :error="$v.form.comment.$error"
        is-optional
        label-for="input-comment"
        :title="$t('comment')"
      >
        <textarea
          id="input-comment"
          v-model.trim="$v.form.comment.$model"
          class="form-input"
          type="text"
        />
        <template slot="inputError">
          <FormInputError
            :form-input="$v.form.comment"
            validation-property="maxLength"
          >
            {{ $t('globalValidationLength') }}
          </FormInputError>
          <slot name="inputError" />
        </template>
      </FormInput>
    </Form>
  </section>
</template>

<script lang="ts">
import { maxLength, required } from 'vuelidate/lib/validators'
import consola from 'consola'

import SUGGESTION_CREATE_MUTATION from '~/gql/mutation/suggestion/suggestionCreate.gql'
import { defineComponent } from '#app'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      title: this.$t('titlePage'),
      form: {
        artist: undefined as string | undefined,
        comment: undefined as string | undefined,
        sent: false,
        title: undefined as string | undefined,
        url: undefined as string | undefined,
      },
      graphqlError: undefined as any,
    }
  },
  head() {
    const title = this.title as string
    const description = this.$t('description') as string

    return {
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content:
            'https://creal.' +
            (process.env.NUXT_ENV_STACK_DOMAIN || 'jonas-thelemann.test') +
            this.$router.currentRoute.fullPath,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: title,
        },
      ],
      title,
    }
  },
  methods: {
    async submit() {
      try {
        await this.$global.formPreSubmit(this)
      } catch (error) {
        return
      }

      await this.$apollo
        .mutate({
          mutation: SUGGESTION_CREATE_MUTATION,
          variables: {
            suggestionInput: {
              artist: this.form.artist === '' ? null : this.form.artist,
              comment: this.form.comment === '' ? null : this.form.comment,
              title: this.form.title === '' ? null : this.form.title,
            },
          },
        })
        .then(() => {
          this.$swal({
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            title: this.$t('submitSuccess'),
          })
          this.form.artist = undefined
          this.form.comment = undefined
          this.form.title = undefined
          this.$v.form.$reset()
        })
        .catch((reason) => {
          this.$swal({
            icon: 'error',
            title: this.$t('error'),
            text: reason,
          })
          this.graphqlError = reason
          consola.error(reason)
        })
    },
  },
  validations() {
    return {
      form: {
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
      },
    }
  },
})
</script>

<i18n lang="yml">
de:
  artist: Künstler*in
  artistPlaceholder: Abba
  comment: Kommentar
  description: Schlage DJ cReal Lieder vor.
  error: Fehler
  submitSuccess: Erfolgreich eingereicht.
  title: Titel
  titlePage: Liedvorschläge
  titlePlaceholder: Dancing Queen
en:
  artist: Artist
  artistPlaceholder: Abba
  comment: Comment
  description: Suggest songs to DJ cReal.
  error: Error
  submitSuccess: Submitted successfully.
  title: Title
  titlePage: Song Suggestions
  titlePlaceholder: Dancing Queen
</i18n>
