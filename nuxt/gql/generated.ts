/* eslint-disable no-use-before-define */
import { gql } from 'graphql-tag'
import * as Urql from '@urql/vue'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Cursor: any
  Datetime: any
}

/** All input for the create `Suggestion` mutation. */
export type CreateSuggestionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>
  /** The `Suggestion` to be created by this mutation. */
  suggestion: SuggestionInput
}

/** The output of our create `Suggestion` mutation. */
export type CreateSuggestionPayload = {
  __typename?: 'CreateSuggestionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Suggestion` that was created by this mutation. */
  suggestion?: Maybe<Suggestion>
  /** An edge for our `Suggestion`. May be used by Relay 1. */
  suggestionEdge?: Maybe<SuggestionsEdge>
}

/** The output of our create `Suggestion` mutation. */
export type CreateSuggestionPayloadSuggestionEdgeArgs = {
  orderBy?: InputMaybe<Array<SuggestionsOrderBy>>
}

/** All input for the `deleteSuggestionById` mutation. */
export type DeleteSuggestionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>
  /** The record's id. */
  id: Scalars['Int']
}

/** All input for the `deleteSuggestion` mutation. */
export type DeleteSuggestionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>
  /** The globally unique `ID` which will identify a single `Suggestion` to be deleted. */
  nodeId: Scalars['ID']
}

/** The output of our delete `Suggestion` mutation. */
export type DeleteSuggestionPayload = {
  __typename?: 'DeleteSuggestionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>
  deletedSuggestionId?: Maybe<Scalars['ID']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Suggestion` that was deleted by this mutation. */
  suggestion?: Maybe<Suggestion>
  /** An edge for our `Suggestion`. May be used by Relay 1. */
  suggestionEdge?: Maybe<SuggestionsEdge>
}

/** The output of our delete `Suggestion` mutation. */
export type DeleteSuggestionPayloadSuggestionEdgeArgs = {
  orderBy?: InputMaybe<Array<SuggestionsOrderBy>>
}

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation'
  /** Creates a single `Suggestion`. */
  createSuggestion?: Maybe<CreateSuggestionPayload>
  /** Deletes a single `Suggestion` using its globally unique id. */
  deleteSuggestion?: Maybe<DeleteSuggestionPayload>
  /** Deletes a single `Suggestion` using a unique key. */
  deleteSuggestionById?: Maybe<DeleteSuggestionPayload>
  /** Updates a single `Suggestion` using its globally unique id and a patch. */
  updateSuggestion?: Maybe<UpdateSuggestionPayload>
  /** Updates a single `Suggestion` using a unique key and a patch. */
  updateSuggestionById?: Maybe<UpdateSuggestionPayload>
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSuggestionArgs = {
  input: CreateSuggestionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSuggestionArgs = {
  input: DeleteSuggestionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSuggestionByIdArgs = {
  input: DeleteSuggestionByIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSuggestionArgs = {
  input: UpdateSuggestionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSuggestionByIdArgs = {
  input: UpdateSuggestionByIdInput
}

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query'
  /** Reads and enables pagination through a set of `Suggestion`. */
  allSuggestions?: Maybe<SuggestionsConnection>
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query
  /** Reads a single `Suggestion` using its globally unique `ID`. */
  suggestion?: Maybe<Suggestion>
  suggestionById?: Maybe<Suggestion>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllSuggestionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>
  before?: InputMaybe<Scalars['Cursor']>
  condition?: InputMaybe<SuggestionCondition>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SuggestionsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']
}

/** The root query type which gives access points into the data universe. */
export type QuerySuggestionArgs = {
  nodeId: Scalars['ID']
}

/** The root query type which gives access points into the data universe. */
export type QuerySuggestionByIdArgs = {
  id: Scalars['Int']
}

/** A song suggestion. */
export type Suggestion = Node & {
  __typename?: 'Suggestion'
  /** The suggestion's artist name. */
  artist: Scalars['String']
  /** A comment on the suggestion. */
  comment?: Maybe<Scalars['String']>
  /** The record's id. */
  id: Scalars['Int']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']
  /** Indicates at which time the record is suggested. */
  timestamp: Scalars['Datetime']
  /** The suggestion's title. */
  title: Scalars['String']
  /** The suggestion's url. */
  url?: Maybe<Scalars['String']>
}

/**
 * A condition to be used against `Suggestion` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type SuggestionCondition = {
  /** Checks for equality with the object’s `artist` field. */
  artist?: InputMaybe<Scalars['String']>
  /** Checks for equality with the object’s `comment` field. */
  comment?: InputMaybe<Scalars['String']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp?: InputMaybe<Scalars['Datetime']>
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>
  /** Checks for equality with the object’s `url` field. */
  url?: InputMaybe<Scalars['String']>
}

/** An input for mutations affecting `Suggestion` */
export type SuggestionInput = {
  /** The suggestion's artist name. */
  artist: Scalars['String']
  /** A comment on the suggestion. */
  comment?: InputMaybe<Scalars['String']>
  /** The suggestion's title. */
  title: Scalars['String']
  /** The suggestion's url. */
  url?: InputMaybe<Scalars['String']>
}

/** Represents an update to a `Suggestion`. Fields that are set will be updated. */
export type SuggestionPatch = {
  /** The suggestion's artist name. */
  artist?: InputMaybe<Scalars['String']>
  /** A comment on the suggestion. */
  comment?: InputMaybe<Scalars['String']>
  /** The record's id. */
  id?: InputMaybe<Scalars['Int']>
  /** Indicates at which time the record is suggested. */
  timestamp?: InputMaybe<Scalars['Datetime']>
  /** The suggestion's title. */
  title?: InputMaybe<Scalars['String']>
  /** The suggestion's url. */
  url?: InputMaybe<Scalars['String']>
}

/** A connection to a list of `Suggestion` values. */
export type SuggestionsConnection = {
  __typename?: 'SuggestionsConnection'
  /** A list of edges which contains the `Suggestion` and cursor to aid in pagination. */
  edges: Array<SuggestionsEdge>
  /** A list of `Suggestion` objects. */
  nodes: Array<Maybe<Suggestion>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Suggestion` you could get from the connection. */
  totalCount: Scalars['Int']
}

/** A `Suggestion` edge in the connection. */
export type SuggestionsEdge = {
  __typename?: 'SuggestionsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>
  /** The `Suggestion` at the end of the edge. */
  node?: Maybe<Suggestion>
}

/** Methods to use when ordering `Suggestion`. */
export enum SuggestionsOrderBy {
  ArtistAsc = 'ARTIST_ASC',
  ArtistDesc = 'ARTIST_DESC',
  CommentAsc = 'COMMENT_ASC',
  CommentDesc = 'COMMENT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC',
}

/** All input for the `updateSuggestionById` mutation. */
export type UpdateSuggestionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>
  /** The record's id. */
  id: Scalars['Int']
  /** An object where the defined keys will be set on the `Suggestion` being updated. */
  suggestionPatch: SuggestionPatch
}

/** All input for the `updateSuggestion` mutation. */
export type UpdateSuggestionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>
  /** The globally unique `ID` which will identify a single `Suggestion` to be updated. */
  nodeId: Scalars['ID']
  /** An object where the defined keys will be set on the `Suggestion` being updated. */
  suggestionPatch: SuggestionPatch
}

/** The output of our update `Suggestion` mutation. */
export type UpdateSuggestionPayload = {
  __typename?: 'UpdateSuggestionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Suggestion` that was updated by this mutation. */
  suggestion?: Maybe<Suggestion>
  /** An edge for our `Suggestion`. May be used by Relay 1. */
  suggestionEdge?: Maybe<SuggestionsEdge>
}

/** The output of our update `Suggestion` mutation. */
export type UpdateSuggestionPayloadSuggestionEdgeArgs = {
  orderBy?: InputMaybe<Array<SuggestionsOrderBy>>
}

export type SuggestionFieldsFragment = {
  __typename?: 'Suggestion'
  id: number
  nodeId: string
  artist: string
  comment?: string | null
  title: string
}

export type CreateSuggestionMutationVariables = Exact<{
  suggestionInput: SuggestionInput
}>

export type CreateSuggestionMutation = {
  __typename?: 'Mutation'
  createSuggestion?: {
    __typename?: 'CreateSuggestionPayload'
    suggestion?: {
      __typename?: 'Suggestion'
      id: number
      nodeId: string
      artist: string
      comment?: string | null
      title: string
    } | null
  } | null
}

export type AllSuggestionsQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['Cursor']>
  limit: Scalars['Int']
}>

export type AllSuggestionsQuery = {
  __typename?: 'Query'
  allSuggestions?: {
    __typename?: 'SuggestionsConnection'
    nodes: Array<{
      __typename?: 'Suggestion'
      id: number
      nodeId: string
      artist: string
      comment?: string | null
      title: string
    } | null>
    pageInfo: {
      __typename?: 'PageInfo'
      endCursor?: any | null
      hasNextPage: boolean
    }
  } | null
}

export const SuggestionFieldsFragmentDoc = gql`
  fragment suggestionFields on Suggestion {
    id
    nodeId
    artist
    comment
    title
  }
`
export const CreateSuggestionDocument = gql`
  mutation createSuggestion($suggestionInput: SuggestionInput!) {
    createSuggestion(input: { suggestion: $suggestionInput }) {
      suggestion {
        ...suggestionFields
      }
    }
  }
  ${SuggestionFieldsFragmentDoc}
`

export function useCreateSuggestionMutation() {
  return Urql.useMutation<
    CreateSuggestionMutation,
    CreateSuggestionMutationVariables
  >(CreateSuggestionDocument)
}
export const AllSuggestionsDocument = gql`
  query allSuggestions($cursor: Cursor, $limit: Int!) {
    allSuggestions(after: $cursor, first: $limit) {
      nodes {
        ...suggestionFields
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${SuggestionFieldsFragmentDoc}
`

export function useAllSuggestionsQuery(
  options: Omit<
    Urql.UseQueryArgs<never, AllSuggestionsQueryVariables>,
    'query'
  > = {}
) {
  return Urql.useQuery<AllSuggestionsQuery>({
    query: AllSuggestionsDocument,
    ...options,
  })
}
