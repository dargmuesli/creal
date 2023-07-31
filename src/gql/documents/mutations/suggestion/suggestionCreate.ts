import { useMutation } from '@urql/vue'
import { graphql } from '~/gql/generated'

export const useCreateSuggestionMutation = () =>
  useMutation(
    graphql(`
      mutation createSuggestion($suggestionInput: SuggestionInput!) {
        createSuggestion(input: { suggestion: $suggestionInput }) {
          suggestion {
            ...SuggestionItem
          }
        }
      }
    `),
  )
