export default () => {
  return {
    httpEndpoint: process.server
      ? 'http://creal_postgraphile:5000/graphql'
      : 'https://creal-postgraphile.' +
        (process.env.NUXT_ENV_STACK_DOMAIN || 'jonas-thelemann.test') +
        '/graphql',
  }
}
