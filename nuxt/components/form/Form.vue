<template>
  <form
    v-if="form"
    ref="form"
    class="card dark:card-dark rounded"
    :class="[
      {
        'animate-shake border border-red-500':
          graphqlErrorComputed !== undefined,
      },
      formClass,
    ]"
    novalidate
    @submit="(e) => $emit('submit', e)"
  >
    <slot />
    <div class="mb-4 mt-6 flex flex-col items-center justify-between">
      <Button
        ref="buttonSubmit"
        :aria-label="submitName"
        :class="{
          'animate-shake': form.$anyError,
        }"
        type="submit"
        @click="$emit('click')"
      >
        {{ submitName }}
      </Button>
      <FormInputError v-if="form.$anyError" class="mt-2">
        {{ t('validationFailed') }}
      </FormInputError>
    </div>
    <CardAlert
      class="mt-4"
      :error-message="
        graphqlErrorComputed ? String(graphqlErrorComputed) : undefined
      "
    />
  </form>
</template>

<script lang="ts">
import Button from '~/components/Button.vue'

const Form = defineComponent({
  name: 'CrealForm',
  props: {
    form: {
      required: true,
      type: Object,
    },
    formClass: {
      default: undefined,
      type: String as PropType<string | undefined>,
    },
    formSent: {
      required: true,
      type: Boolean,
    },
    graphqlError: {
      default: undefined,
      type: Error as PropType<any>,
    },
    submitName: {
      default() {
        return t('submit')
      },
      type: String,
    },
  },
  setup() {
    const buttonSubmit = ref<InstanceType<typeof Button>>()

    const submit = () => {
      if (buttonSubmit) {
        buttonSubmit.value?.click()
      }
    }

    return {
      buttonSubmit,
      submit,
    }
  },
  data() {
    return {
      // TODO: remove with https://github.com/maevsi/maevsi/issues/209.
      graphqlErrorInternal: undefined as any,
    }
  },
  computed: {
    graphqlErrorComputed(): any {
      if (!this.graphqlError) {
        return
      }

      return [
        ...((this.graphqlError as any).graphQLErrors?.map(
          (e: Error) => e.message
        ) ?? []),
        ...(this.graphqlErrorInternal ? [this.graphqlErrorInternal] : []),
      ].join(', ')
    },
  },
  methods: {
    reset() {
      ;(this.$refs.form as HTMLFormElement).reset()
    },
  },
})

export default Form

export type FormType = InstanceType<typeof Form>
</script>

<i18n lang="yaml">
de:
  submit: Absenden
  validationFailed: Bitte überprüfe deine Eingaben 🙈
en:
  submit: Submit
  validationFailed: Please check your input 🙈
</i18n>
