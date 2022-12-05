<template>
  <div class="mb-4 flex items-center gap-2 overflow-auto">
    <AppLink :to="localePath('/')"><IconHome classes="h-8 w-8" /></AppLink>
    <span>{{ t('separator') }}</span>
    <AppLink :to="$util.getQueryString({})">
      <h1 class="m-0 whitespace-nowrap"><slot /></h1>
    </AppLink>
    <ul v-if="suffixes" class="flex items-center gap-2">
      <li
        v-for="(suffix, index) in suffixes"
        :key="suffix"
        class="flex items-center gap-2"
      >
        <span>{{ t('separator') }}</span>
        <AppLink
          :to="
            $util.getQueryString({
              [suffixesKey]: getQueryLink(index),
            })
          "
        >
          <span class="whitespace-nowrap text-4xl">{{ suffix }}</span>
        </AppLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'CrealBreadcrumbs',
  props: {
    suffixes: {
      default: undefined,
      type: Array as PropType<Array<string>>,
    },
    suffixesKey: {
      default: undefined,
      type: String,
    },
  },
  methods: {
    getQueryLink(index: number) {
      let queryLink = ''

      for (let i = 0; i < this.suffixes.length && i <= index; i++) {
        if (i !== 0) {
          queryLink += '/'
        }

        queryLink += this.suffixes[i]
      }

      return queryLink
    },
  },
})
</script>

<i18n lang="yaml">
de:
  separator: /
en:
  separator: /
</i18n>
