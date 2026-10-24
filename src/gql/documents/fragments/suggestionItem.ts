import { graphql } from '~~/gql/generated'

export const SuggestionItem = graphql(`
  fragment SuggestionItem on Suggestion {
    id
    artist
    comment
    title
  }
`)
