import type { S3Client } from '@aws-sdk/client-s3'

declare module 'h3' {
  interface H3EventContext {
    $s3?: S3Client
  }
}

export {}
