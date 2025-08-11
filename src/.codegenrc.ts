import type { CodegenConfig } from '@graphql-codegen/cli'

export const codegenConfig: CodegenConfig = {
  // schema: 'https://creal-postgraphile.localhost/graphql',
  schema: 'https://creal-postgraphile.jonas-thelemann.de/graphql',
  documents: ['gql/documents/**/*.ts', 'app/**/*.vue'],
  hooks: { afterAllFileWrite: ['prettier --write', 'eslint --fix'] },
  config: {
    useTypeImports: true,
  },
  generates: {
    './gql/generated/': {
      preset: 'client',
    },
    'gql/generated/graphcache.ts': {
      plugins: [
        {
          add: {
            content: `/* eslint-disable @typescript-eslint/no-empty-object-type */\n/* eslint-disable @typescript-eslint/no-explicit-any */\n/* eslint-disable import/no-duplicates */`,
          },
        },
        'typescript',
        'typescript-urql-graphcache',
      ],
    },
    'gql/generated/introspection.ts': {
      plugins: ['urql-introspection'],
    },
  },
}

export default codegenConfig
