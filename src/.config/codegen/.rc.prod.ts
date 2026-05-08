import type { CodegenConfig } from '@graphql-codegen/cli'

import { codegenConfigBase } from './.rc'

const codegenConfig: CodegenConfig = {
  ...codegenConfigBase,
  schema: 'https://creal-postgraphile.jonas-thelemann.de/graphql',
}

export default codegenConfig
