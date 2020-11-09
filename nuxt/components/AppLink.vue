<template>
  <div v-bind="linkProps(to)">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  methods: {
    linkProps(url) {
      if (url.match(/^(http(s)?|ftp):\/\//)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener noreferrer',
        }
      }
      return {
        is: 'router-link',
        to: url,
      }
    },
  },
}
</script>
