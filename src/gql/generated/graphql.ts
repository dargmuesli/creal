/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
/** An input for mutations affecting `Suggestion` */
export type SuggestionInput = {
  /** The suggestion's artist name. */
  artist: string
  /** A comment on the suggestion. */
  comment?: string | null | undefined
  /** The suggestion's title. */
  title: string
  /** The suggestion's url. */
  url?: string | null | undefined
}

export type SuggestionItemFragment = {
  id: number
  nodeId: string
  artist: string
  comment: string | null
  title: string
} & { ' $fragmentName'?: 'SuggestionItemFragment' }

export type CreateSuggestionMutationVariables = Exact<{
  suggestionInput: SuggestionInput
}>

export type CreateSuggestionMutation = {
  createSuggestion: {
    suggestion: {
      ' $fragmentRefs'?: { SuggestionItemFragment: SuggestionItemFragment }
    } | null
  } | null
}

export const SuggestionItemFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SuggestionItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Suggestion' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'artist' } },
          { kind: 'Field', name: { kind: 'Name', value: 'comment' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SuggestionItemFragment, unknown>
export const CreateSuggestionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createSuggestion' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'suggestionInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SuggestionInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createSuggestion' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'suggestion' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'suggestionInput' },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'suggestion' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'SuggestionItem' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SuggestionItem' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Suggestion' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'artist' } },
          { kind: 'Field', name: { kind: 'Name', value: 'comment' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateSuggestionMutation,
  CreateSuggestionMutationVariables
>
