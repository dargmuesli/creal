import type { IntrospectionQuery } from 'graphql'
export default {
  __schema: {
    queryType: {
      name: 'Query',
      kind: 'OBJECT',
    },
    mutationType: {
      name: 'Mutation',
      kind: 'OBJECT',
    },
    subscriptionType: null,
    types: [
      {
        kind: 'OBJECT',
        name: 'CreateSuggestionPayload',
        fields: [
          {
            name: 'clientMutationId',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'query',
            type: {
              kind: 'OBJECT',
              name: 'Query',
              ofType: null,
            },
            args: [],
          },
          {
            name: 'suggestion',
            type: {
              kind: 'OBJECT',
              name: 'Suggestion',
              ofType: null,
            },
            args: [],
          },
          {
            name: 'suggestionEdge',
            type: {
              kind: 'OBJECT',
              name: 'SuggestionEdge',
              ofType: null,
            },
            args: [
              {
                name: 'orderBy',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'LIST',
                    ofType: {
                      kind: 'NON_NULL',
                      ofType: {
                        kind: 'SCALAR',
                        name: 'Any',
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'DeleteSuggestionPayload',
        fields: [
          {
            name: 'clientMutationId',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'deletedSuggestionId',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'query',
            type: {
              kind: 'OBJECT',
              name: 'Query',
              ofType: null,
            },
            args: [],
          },
          {
            name: 'suggestion',
            type: {
              kind: 'OBJECT',
              name: 'Suggestion',
              ofType: null,
            },
            args: [],
          },
          {
            name: 'suggestionEdge',
            type: {
              kind: 'OBJECT',
              name: 'SuggestionEdge',
              ofType: null,
            },
            args: [
              {
                name: 'orderBy',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'LIST',
                    ofType: {
                      kind: 'NON_NULL',
                      ofType: {
                        kind: 'SCALAR',
                        name: 'Any',
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'Mutation',
        fields: [
          {
            name: 'createSuggestion',
            type: {
              kind: 'OBJECT',
              name: 'CreateSuggestionPayload',
              ofType: null,
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'deleteSuggestion',
            type: {
              kind: 'OBJECT',
              name: 'DeleteSuggestionPayload',
              ofType: null,
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'deleteSuggestionByRowId',
            type: {
              kind: 'OBJECT',
              name: 'DeleteSuggestionPayload',
              ofType: null,
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'updateSuggestion',
            type: {
              kind: 'OBJECT',
              name: 'UpdateSuggestionPayload',
              ofType: null,
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'updateSuggestionByRowId',
            type: {
              kind: 'OBJECT',
              name: 'UpdateSuggestionPayload',
              ofType: null,
            },
            args: [
              {
                name: 'input',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'INTERFACE',
        name: 'Node',
        fields: [
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
        possibleTypes: [
          {
            kind: 'OBJECT',
            name: 'Query',
          },
          {
            kind: 'OBJECT',
            name: 'Suggestion',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'PageInfo',
        fields: [
          {
            name: 'endCursor',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'hasNextPage',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'hasPreviousPage',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'startCursor',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'Query',
        fields: [
          {
            name: 'allSuggestions',
            type: {
              kind: 'OBJECT',
              name: 'SuggestionConnection',
              ofType: null,
            },
            args: [
              {
                name: 'after',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'before',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'condition',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'first',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'last',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'offset',
                type: {
                  kind: 'SCALAR',
                  name: 'Any',
                },
              },
              {
                name: 'orderBy',
                type: {
                  kind: 'LIST',
                  ofType: {
                    kind: 'NON_NULL',
                    ofType: {
                      kind: 'SCALAR',
                      name: 'Any',
                    },
                  },
                },
              },
            ],
          },
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'node',
            type: {
              kind: 'INTERFACE',
              name: 'Node',
              ofType: null,
            },
            args: [
              {
                name: 'id',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'query',
            type: {
              kind: 'NON_NULL',
              ofType: {
                name: 'Query',
                kind: 'OBJECT',
                ofType: null,
              },
            },
            args: [],
          },
          {
            name: 'suggestion',
            type: {
              kind: 'OBJECT',
              name: 'Suggestion',
              ofType: null,
            },
            args: [
              {
                name: 'id',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
          {
            name: 'suggestionByRowId',
            type: {
              kind: 'OBJECT',
              name: 'Suggestion',
              ofType: null,
            },
            args: [
              {
                name: 'rowId',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'SCALAR',
                    name: 'Any',
                  },
                },
              },
            ],
          },
        ],
        interfaces: [
          {
            kind: 'INTERFACE',
            name: 'Node',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'Suggestion',
        fields: [
          {
            name: 'artist',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'comment',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'rowId',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'timestamp',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'title',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
          {
            name: 'url',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
        ],
        interfaces: [
          {
            kind: 'INTERFACE',
            name: 'Node',
          },
        ],
      },
      {
        kind: 'OBJECT',
        name: 'SuggestionConnection',
        fields: [
          {
            name: 'edges',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    name: 'SuggestionEdge',
                    kind: 'OBJECT',
                    ofType: null,
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'nodes',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'LIST',
                ofType: {
                  kind: 'NON_NULL',
                  ofType: {
                    name: 'Suggestion',
                    kind: 'OBJECT',
                    ofType: null,
                  },
                },
              },
            },
            args: [],
          },
          {
            name: 'pageInfo',
            type: {
              kind: 'NON_NULL',
              ofType: {
                name: 'PageInfo',
                kind: 'OBJECT',
                ofType: null,
              },
            },
            args: [],
          },
          {
            name: 'totalCount',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Any',
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'SuggestionEdge',
        fields: [
          {
            name: 'cursor',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'node',
            type: {
              kind: 'NON_NULL',
              ofType: {
                name: 'Suggestion',
                kind: 'OBJECT',
                ofType: null,
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'OBJECT',
        name: 'UpdateSuggestionPayload',
        fields: [
          {
            name: 'clientMutationId',
            type: {
              kind: 'SCALAR',
              name: 'Any',
            },
            args: [],
          },
          {
            name: 'query',
            type: {
              kind: 'OBJECT',
              name: 'Query',
              ofType: null,
            },
            args: [],
          },
          {
            name: 'suggestion',
            type: {
              kind: 'OBJECT',
              name: 'Suggestion',
              ofType: null,
            },
            args: [],
          },
          {
            name: 'suggestionEdge',
            type: {
              kind: 'OBJECT',
              name: 'SuggestionEdge',
              ofType: null,
            },
            args: [
              {
                name: 'orderBy',
                type: {
                  kind: 'NON_NULL',
                  ofType: {
                    kind: 'LIST',
                    ofType: {
                      kind: 'NON_NULL',
                      ofType: {
                        kind: 'SCALAR',
                        name: 'Any',
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
        interfaces: [],
      },
      {
        kind: 'SCALAR',
        name: 'Any',
      },
    ],
    directives: [],
  },
} as unknown as IntrospectionQuery
