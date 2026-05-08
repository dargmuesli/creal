import type { CodegenConfig } from '@graphql-codegen/cli'

import { codegenConfigBase } from './.rc'

const codegenConfig: CodegenConfig = {
  ...codegenConfigBase,
  schema: 'https://creal-postgraphile.localhost/graphql',
}

export default codegenConfig
