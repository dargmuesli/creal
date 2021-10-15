export default () => {
  return {
    httpEndpoint: process.server
      ? 'http://creal-postgraphile:5000/graphql'
      : 'https://creal-postgraphile.' +
        (process.env.NUXT_ENV_STACK_DOMAIN || 'creal.jonas-thelemann.test') +
        '/graphql',
  }
}
