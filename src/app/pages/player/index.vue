<script setup lang="ts">
const mixLocalePath = useMixLocalePath()
const route = useRoute()

const playlist =
  typeof route.query.playlist === 'string' ? route.query.playlist : undefined
const track =
  typeof route.query.track === 'string' ? route.query.track : undefined

// Redirects legacy query-param links to the new path-based /mixes scheme.
await navigateTo(
  mixLocalePath(
    track ? getTrackPath(playlist, track) : getCollectionPath(playlist),
  ),
  { redirectCode: 301 },
)
</script>
