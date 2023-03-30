import { graphql } from '~/gql/generated'

export const SuggestionItem = graphql(`
  fragment SuggestionItem on Suggestion {
    id
    nodeId
    artist
    comment
    title
  }
`)
