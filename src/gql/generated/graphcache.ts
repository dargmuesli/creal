/* eslint-disable no-use-before-define */
import type {
  offlineExchange,
  Resolver as GraphCacheResolver,
  UpdateResolver as GraphCacheUpdateResolver,
  OptimisticMutationResolver as GraphCacheOptimisticMutationResolver,
} from '@urql/exchange-graphcache'

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
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Cursor: { input: any; output: any }
  Datetime: { input: any; output: any }
}

/** All input for the create `Suggestion` mutation. */
export type CreateSuggestionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
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
  clientMutationId?: Maybe<Scalars['String']['output']>
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
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The record's id. */
  id: Scalars['Int']['input']
}

/** All input for the `deleteSuggestion` mutation. */
export type DeleteSuggestionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Suggestion` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** The output of our delete `Suggestion` mutation. */
export type DeleteSuggestionPayload = {
  __typename?: 'DeleteSuggestionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedSuggestionId?: Maybe<Scalars['ID']['output']>
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
  nodeId: Scalars['ID']['output']
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query'
  /** Reads and enables pagination through a set of `Suggestion`. */
  allSuggestions?: Maybe<SuggestionsConnection>
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output']
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
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<SuggestionCondition>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<SuggestionsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QuerySuggestionArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QuerySuggestionByIdArgs = {
  id: Scalars['Int']['input']
}

/** A song suggestion. */
export type Suggestion = Node & {
  __typename?: 'Suggestion'
  /** The suggestion's artist name. */
  artist: Scalars['String']['output']
  /** A comment on the suggestion. */
  comment?: Maybe<Scalars['String']['output']>
  /** The record's id. */
  id: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  /** Indicates at which time the record is suggested. */
  timestamp: Scalars['Datetime']['output']
  /** The suggestion's title. */
  title: Scalars['String']['output']
  /** The suggestion's url. */
  url?: Maybe<Scalars['String']['output']>
}

/**
 * A condition to be used against `Suggestion` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type SuggestionCondition = {
  /** Checks for equality with the object’s `artist` field. */
  artist?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `comment` field. */
  comment?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp?: InputMaybe<Scalars['Datetime']['input']>
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `url` field. */
  url?: InputMaybe<Scalars['String']['input']>
}

/** An input for mutations affecting `Suggestion` */
export type SuggestionInput = {
  /** The suggestion's artist name. */
  artist: Scalars['String']['input']
  /** A comment on the suggestion. */
  comment?: InputMaybe<Scalars['String']['input']>
  /** The suggestion's title. */
  title: Scalars['String']['input']
  /** The suggestion's url. */
  url?: InputMaybe<Scalars['String']['input']>
}

/** Represents an update to a `Suggestion`. Fields that are set will be updated. */
export type SuggestionPatch = {
  /** The suggestion's artist name. */
  artist?: InputMaybe<Scalars['String']['input']>
  /** A comment on the suggestion. */
  comment?: InputMaybe<Scalars['String']['input']>
  /** The record's id. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Indicates at which time the record is suggested. */
  timestamp?: InputMaybe<Scalars['Datetime']['input']>
  /** The suggestion's title. */
  title?: InputMaybe<Scalars['String']['input']>
  /** The suggestion's url. */
  url?: InputMaybe<Scalars['String']['input']>
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
  totalCount: Scalars['Int']['output']
}

/** A `Suggestion` edge in the connection. */
export type SuggestionsEdge = {
  __typename?: 'SuggestionsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
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
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The record's id. */
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Suggestion` being updated. */
  suggestionPatch: SuggestionPatch
}

/** All input for the `updateSuggestion` mutation. */
export type UpdateSuggestionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Suggestion` to be updated. */
  nodeId: Scalars['ID']['input']
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
  clientMutationId?: Maybe<Scalars['String']['output']>
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

export type WithTypename<T extends { __typename?: any }> = Partial<T> & {
  __typename: NonNullable<T['__typename']>
}

export type GraphCacheKeysConfig = {
  CreateSuggestionPayload?: (
    data: WithTypename<CreateSuggestionPayload>,
  ) => null | string
  DeleteSuggestionPayload?: (
    data: WithTypename<DeleteSuggestionPayload>,
  ) => null | string
  PageInfo?: (data: WithTypename<PageInfo>) => null | string
  Suggestion?: (data: WithTypename<Suggestion>) => null | string
  SuggestionsConnection?: (
    data: WithTypename<SuggestionsConnection>,
  ) => null | string
  SuggestionsEdge?: (data: WithTypename<SuggestionsEdge>) => null | string
  UpdateSuggestionPayload?: (
    data: WithTypename<UpdateSuggestionPayload>,
  ) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    allSuggestions?: GraphCacheResolver<
      WithTypename<Query>,
      QueryAllSuggestionsArgs,
      WithTypename<SuggestionsConnection> | string
    >
    node?: GraphCacheResolver<
      WithTypename<Query>,
      QueryNodeArgs,
      WithTypename<Query> | WithTypename<Suggestion> | string
    >
    nodeId?: GraphCacheResolver<
      WithTypename<Query>,
      Record<string, never>,
      Scalars['ID'] | string
    >
    query?: GraphCacheResolver<
      WithTypename<Query>,
      Record<string, never>,
      WithTypename<Query> | string
    >
    suggestion?: GraphCacheResolver<
      WithTypename<Query>,
      QuerySuggestionArgs,
      WithTypename<Suggestion> | string
    >
    suggestionById?: GraphCacheResolver<
      WithTypename<Query>,
      QuerySuggestionByIdArgs,
      WithTypename<Suggestion> | string
    >
  }
  CreateSuggestionPayload?: {
    clientMutationId?: GraphCacheResolver<
      WithTypename<CreateSuggestionPayload>,
      Record<string, never>,
      Scalars['String'] | string
    >
    query?: GraphCacheResolver<
      WithTypename<CreateSuggestionPayload>,
      Record<string, never>,
      WithTypename<Query> | string
    >
    suggestion?: GraphCacheResolver<
      WithTypename<CreateSuggestionPayload>,
      Record<string, never>,
      WithTypename<Suggestion> | string
    >
    suggestionEdge?: GraphCacheResolver<
      WithTypename<CreateSuggestionPayload>,
      CreateSuggestionPayloadSuggestionEdgeArgs,
      WithTypename<SuggestionsEdge> | string
    >
  }
  DeleteSuggestionPayload?: {
    clientMutationId?: GraphCacheResolver<
      WithTypename<DeleteSuggestionPayload>,
      Record<string, never>,
      Scalars['String'] | string
    >
    deletedSuggestionId?: GraphCacheResolver<
      WithTypename<DeleteSuggestionPayload>,
      Record<string, never>,
      Scalars['ID'] | string
    >
    query?: GraphCacheResolver<
      WithTypename<DeleteSuggestionPayload>,
      Record<string, never>,
      WithTypename<Query> | string
    >
    suggestion?: GraphCacheResolver<
      WithTypename<DeleteSuggestionPayload>,
      Record<string, never>,
      WithTypename<Suggestion> | string
    >
    suggestionEdge?: GraphCacheResolver<
      WithTypename<DeleteSuggestionPayload>,
      DeleteSuggestionPayloadSuggestionEdgeArgs,
      WithTypename<SuggestionsEdge> | string
    >
  }
  PageInfo?: {
    endCursor?: GraphCacheResolver<
      WithTypename<PageInfo>,
      Record<string, never>,
      Scalars['Cursor'] | string
    >
    hasNextPage?: GraphCacheResolver<
      WithTypename<PageInfo>,
      Record<string, never>,
      Scalars['Boolean'] | string
    >
    hasPreviousPage?: GraphCacheResolver<
      WithTypename<PageInfo>,
      Record<string, never>,
      Scalars['Boolean'] | string
    >
    startCursor?: GraphCacheResolver<
      WithTypename<PageInfo>,
      Record<string, never>,
      Scalars['Cursor'] | string
    >
  }
  Suggestion?: {
    artist?: GraphCacheResolver<
      WithTypename<Suggestion>,
      Record<string, never>,
      Scalars['String'] | string
    >
    comment?: GraphCacheResolver<
      WithTypename<Suggestion>,
      Record<string, never>,
      Scalars['String'] | string
    >
    id?: GraphCacheResolver<
      WithTypename<Suggestion>,
      Record<string, never>,
      Scalars['Int'] | string
    >
    nodeId?: GraphCacheResolver<
      WithTypename<Suggestion>,
      Record<string, never>,
      Scalars['ID'] | string
    >
    timestamp?: GraphCacheResolver<
      WithTypename<Suggestion>,
      Record<string, never>,
      Scalars['Datetime'] | string
    >
    title?: GraphCacheResolver<
      WithTypename<Suggestion>,
      Record<string, never>,
      Scalars['String'] | string
    >
    url?: GraphCacheResolver<
      WithTypename<Suggestion>,
      Record<string, never>,
      Scalars['String'] | string
    >
  }
  SuggestionsConnection?: {
    edges?: GraphCacheResolver<
      WithTypename<SuggestionsConnection>,
      Record<string, never>,
      Array<WithTypename<SuggestionsEdge> | string>
    >
    nodes?: GraphCacheResolver<
      WithTypename<SuggestionsConnection>,
      Record<string, never>,
      Array<WithTypename<Suggestion> | string>
    >
    pageInfo?: GraphCacheResolver<
      WithTypename<SuggestionsConnection>,
      Record<string, never>,
      WithTypename<PageInfo> | string
    >
    totalCount?: GraphCacheResolver<
      WithTypename<SuggestionsConnection>,
      Record<string, never>,
      Scalars['Int'] | string
    >
  }
  SuggestionsEdge?: {
    cursor?: GraphCacheResolver<
      WithTypename<SuggestionsEdge>,
      Record<string, never>,
      Scalars['Cursor'] | string
    >
    node?: GraphCacheResolver<
      WithTypename<SuggestionsEdge>,
      Record<string, never>,
      WithTypename<Suggestion> | string
    >
  }
  UpdateSuggestionPayload?: {
    clientMutationId?: GraphCacheResolver<
      WithTypename<UpdateSuggestionPayload>,
      Record<string, never>,
      Scalars['String'] | string
    >
    query?: GraphCacheResolver<
      WithTypename<UpdateSuggestionPayload>,
      Record<string, never>,
      WithTypename<Query> | string
    >
    suggestion?: GraphCacheResolver<
      WithTypename<UpdateSuggestionPayload>,
      Record<string, never>,
      WithTypename<Suggestion> | string
    >
    suggestionEdge?: GraphCacheResolver<
      WithTypename<UpdateSuggestionPayload>,
      UpdateSuggestionPayloadSuggestionEdgeArgs,
      WithTypename<SuggestionsEdge> | string
    >
  }
}

export type GraphCacheOptimisticUpdaters = {
  createSuggestion?: GraphCacheOptimisticMutationResolver<
    MutationCreateSuggestionArgs,
    Maybe<WithTypename<CreateSuggestionPayload>>
  >
  deleteSuggestion?: GraphCacheOptimisticMutationResolver<
    MutationDeleteSuggestionArgs,
    Maybe<WithTypename<DeleteSuggestionPayload>>
  >
  deleteSuggestionById?: GraphCacheOptimisticMutationResolver<
    MutationDeleteSuggestionByIdArgs,
    Maybe<WithTypename<DeleteSuggestionPayload>>
  >
  updateSuggestion?: GraphCacheOptimisticMutationResolver<
    MutationUpdateSuggestionArgs,
    Maybe<WithTypename<UpdateSuggestionPayload>>
  >
  updateSuggestionById?: GraphCacheOptimisticMutationResolver<
    MutationUpdateSuggestionByIdArgs,
    Maybe<WithTypename<UpdateSuggestionPayload>>
  >
}

export type GraphCacheUpdaters = {
  Query?: {
    allSuggestions?: GraphCacheUpdateResolver<
      { allSuggestions: Maybe<WithTypename<SuggestionsConnection>> },
      QueryAllSuggestionsArgs
    >
    node?: GraphCacheUpdateResolver<
      { node: Maybe<WithTypename<Query> | WithTypename<Suggestion>> },
      QueryNodeArgs
    >
    nodeId?: GraphCacheUpdateResolver<
      { nodeId: Scalars['ID'] },
      Record<string, never>
    >
    query?: GraphCacheUpdateResolver<
      { query: WithTypename<Query> },
      Record<string, never>
    >
    suggestion?: GraphCacheUpdateResolver<
      { suggestion: Maybe<WithTypename<Suggestion>> },
      QuerySuggestionArgs
    >
    suggestionById?: GraphCacheUpdateResolver<
      { suggestionById: Maybe<WithTypename<Suggestion>> },
      QuerySuggestionByIdArgs
    >
  }
  Mutation?: {
    createSuggestion?: GraphCacheUpdateResolver<
      { createSuggestion: Maybe<WithTypename<CreateSuggestionPayload>> },
      MutationCreateSuggestionArgs
    >
    deleteSuggestion?: GraphCacheUpdateResolver<
      { deleteSuggestion: Maybe<WithTypename<DeleteSuggestionPayload>> },
      MutationDeleteSuggestionArgs
    >
    deleteSuggestionById?: GraphCacheUpdateResolver<
      { deleteSuggestionById: Maybe<WithTypename<DeleteSuggestionPayload>> },
      MutationDeleteSuggestionByIdArgs
    >
    updateSuggestion?: GraphCacheUpdateResolver<
      { updateSuggestion: Maybe<WithTypename<UpdateSuggestionPayload>> },
      MutationUpdateSuggestionArgs
    >
    updateSuggestionById?: GraphCacheUpdateResolver<
      { updateSuggestionById: Maybe<WithTypename<UpdateSuggestionPayload>> },
      MutationUpdateSuggestionByIdArgs
    >
  }
  Subscription?: {}
  CreateSuggestionPayload?: {
    clientMutationId?: GraphCacheUpdateResolver<
      Maybe<WithTypename<CreateSuggestionPayload>>,
      Record<string, never>
    >
    query?: GraphCacheUpdateResolver<
      Maybe<WithTypename<CreateSuggestionPayload>>,
      Record<string, never>
    >
    suggestion?: GraphCacheUpdateResolver<
      Maybe<WithTypename<CreateSuggestionPayload>>,
      Record<string, never>
    >
    suggestionEdge?: GraphCacheUpdateResolver<
      Maybe<WithTypename<CreateSuggestionPayload>>,
      CreateSuggestionPayloadSuggestionEdgeArgs
    >
  }
  DeleteSuggestionPayload?: {
    clientMutationId?: GraphCacheUpdateResolver<
      Maybe<WithTypename<DeleteSuggestionPayload>>,
      Record<string, never>
    >
    deletedSuggestionId?: GraphCacheUpdateResolver<
      Maybe<WithTypename<DeleteSuggestionPayload>>,
      Record<string, never>
    >
    query?: GraphCacheUpdateResolver<
      Maybe<WithTypename<DeleteSuggestionPayload>>,
      Record<string, never>
    >
    suggestion?: GraphCacheUpdateResolver<
      Maybe<WithTypename<DeleteSuggestionPayload>>,
      Record<string, never>
    >
    suggestionEdge?: GraphCacheUpdateResolver<
      Maybe<WithTypename<DeleteSuggestionPayload>>,
      DeleteSuggestionPayloadSuggestionEdgeArgs
    >
  }
  PageInfo?: {
    endCursor?: GraphCacheUpdateResolver<
      Maybe<WithTypename<PageInfo>>,
      Record<string, never>
    >
    hasNextPage?: GraphCacheUpdateResolver<
      Maybe<WithTypename<PageInfo>>,
      Record<string, never>
    >
    hasPreviousPage?: GraphCacheUpdateResolver<
      Maybe<WithTypename<PageInfo>>,
      Record<string, never>
    >
    startCursor?: GraphCacheUpdateResolver<
      Maybe<WithTypename<PageInfo>>,
      Record<string, never>
    >
  }
  Suggestion?: {
    artist?: GraphCacheUpdateResolver<
      Maybe<WithTypename<Suggestion>>,
      Record<string, never>
    >
    comment?: GraphCacheUpdateResolver<
      Maybe<WithTypename<Suggestion>>,
      Record<string, never>
    >
    id?: GraphCacheUpdateResolver<
      Maybe<WithTypename<Suggestion>>,
      Record<string, never>
    >
    nodeId?: GraphCacheUpdateResolver<
      Maybe<WithTypename<Suggestion>>,
      Record<string, never>
    >
    timestamp?: GraphCacheUpdateResolver<
      Maybe<WithTypename<Suggestion>>,
      Record<string, never>
    >
    title?: GraphCacheUpdateResolver<
      Maybe<WithTypename<Suggestion>>,
      Record<string, never>
    >
    url?: GraphCacheUpdateResolver<
      Maybe<WithTypename<Suggestion>>,
      Record<string, never>
    >
  }
  SuggestionsConnection?: {
    edges?: GraphCacheUpdateResolver<
      Maybe<WithTypename<SuggestionsConnection>>,
      Record<string, never>
    >
    nodes?: GraphCacheUpdateResolver<
      Maybe<WithTypename<SuggestionsConnection>>,
      Record<string, never>
    >
    pageInfo?: GraphCacheUpdateResolver<
      Maybe<WithTypename<SuggestionsConnection>>,
      Record<string, never>
    >
    totalCount?: GraphCacheUpdateResolver<
      Maybe<WithTypename<SuggestionsConnection>>,
      Record<string, never>
    >
  }
  SuggestionsEdge?: {
    cursor?: GraphCacheUpdateResolver<
      Maybe<WithTypename<SuggestionsEdge>>,
      Record<string, never>
    >
    node?: GraphCacheUpdateResolver<
      Maybe<WithTypename<SuggestionsEdge>>,
      Record<string, never>
    >
  }
  UpdateSuggestionPayload?: {
    clientMutationId?: GraphCacheUpdateResolver<
      Maybe<WithTypename<UpdateSuggestionPayload>>,
      Record<string, never>
    >
    query?: GraphCacheUpdateResolver<
      Maybe<WithTypename<UpdateSuggestionPayload>>,
      Record<string, never>
    >
    suggestion?: GraphCacheUpdateResolver<
      Maybe<WithTypename<UpdateSuggestionPayload>>,
      Record<string, never>
    >
    suggestionEdge?: GraphCacheUpdateResolver<
      Maybe<WithTypename<UpdateSuggestionPayload>>,
      UpdateSuggestionPayloadSuggestionEdgeArgs
    >
  }
}

export type GraphCacheConfig = Parameters<typeof offlineExchange>[0] & {
  updates?: GraphCacheUpdaters
  keys?: GraphCacheKeysConfig
  optimistic?: GraphCacheOptimisticUpdaters
  resolvers?: GraphCacheResolvers
}
