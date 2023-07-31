import VuePlyr from '@skjnldsv/vue-plyr'
import '@skjnldsv/vue-plyr/dist/vue-plyr.css'

// The second argument is optional and sets the default config values for every player.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VuePlyr, {
    plyr: {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        // 'pip',
        'airplay',
        // 'fullscreen',
      ],
    },
  })
})
