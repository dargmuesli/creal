// Fetches a playlist by S3 prefix, following continuation tokens until the
// listing is complete.
export const fetchPlaylistData = async (prefix?: string): Promise<Playlist> => {
  let continuationToken: string | undefined
  const playlistDataFetch = {
    name: 'root',
    collections: [],
    items: [],
    isCoverAvailable: false,
  } as Playlist

  do {
    const data = await $fetch<FetchPlaylist>('/api/player/playlists', {
      params: {
        ...(continuationToken && {
          'continuation-token': continuationToken,
        }),
        ...(prefix && {
          prefix,
        }),
      },
    })

    mergeByKey(playlistDataFetch, data?.playlistData, 'name')
    continuationToken = data?.nextContinuationToken
  } while (continuationToken)

  return playlistDataFetch
}
