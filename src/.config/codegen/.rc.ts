import type { CodegenConfig } from '@graphql-codegen/cli'

export const codegenConfigBase: CodegenConfig = {
  documents: [
    'gql/documents/**/*.ts',
    'app/**/*.ts',
    'app/**/*.vue',
    'server/**/*.ts',
  ],
  hooks: { afterAllFileWrite: ['prettier --write', 'eslint --fix'] },
  config: {
    useTypeImports: true,
    scalars: {
      Cursor: 'string',
      Datetime: 'string',
      Jwt: 'string',
      UUID: 'string',
    },
  },
  generates: {
    './gql/generated/': {
      preset: 'client',
    },
    'gql/generated/graphcache.ts': {
      plugins: [
        {
          add: {
            content: `/* eslint-disable @typescript-eslint/no-explicit-any */`,
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
