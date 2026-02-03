export const useS3 = () => {
  const event = useEvent()
  const s3 = event.context.$s3

  if (!s3)
    return throwError({
      status: 500,
      statusText: 'Event context is missing S3 data',
    })

  return {
    client: s3,
  }
}
