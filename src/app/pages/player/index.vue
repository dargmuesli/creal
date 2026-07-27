<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()

const playlist =
  typeof route.query.playlist === 'string' ? route.query.playlist : undefined
const track =
  typeof route.query.track === 'string' ? route.query.track : undefined

// Redirects to /mixes when no query params (getMixPath returns MIXES_PATH).
await navigateTo(localePath(getMixPath(playlist, track)), {
  redirectCode: 301,
})
</script>
