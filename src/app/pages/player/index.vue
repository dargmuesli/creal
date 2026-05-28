<script setup lang="ts">
import { getMixPathFromLegacyQuery } from '~/utils/player-route'

const localePath = useLocalePath()
const route = useRoute()

const playlist =
  typeof route.query.playlist === 'string' ? route.query.playlist : undefined
const track =
  typeof route.query.track === 'string' ? route.query.track : undefined

await navigateTo(localePath(getMixPathFromLegacyQuery(playlist, track)), {
  redirectCode: 301,
})
</script>
