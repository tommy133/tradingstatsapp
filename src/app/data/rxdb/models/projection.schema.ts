import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from 'rxdb';

export const PROJECTION_COLLECTION_NAME = 'projections';
export const PROJECTION_SCHEMA_LITERAL = {
  title: 'Projection schema',
  description: 'Projection schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    symbol: {
      type: 'string',
    },
    updown: {
      type: 'number',
    },
    date: {
      type: 'string',
    },
    graph: {
      type: 'string',
    },
    timeframe: {
      type: 'string',
    },
    status: {
      type: 'string',
    },
  },
  required: ['id', 'symbol', 'timeframe', 'status'],
} as const;

const schemaTyped = toTypedRxJsonSchema(PROJECTION_SCHEMA_LITERAL);

export type RxProjectionDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const PROJECTION_SCHEMA: RxJsonSchema<RxProjectionDocumentType> =
  PROJECTION_SCHEMA_LITERAL;

// ORM methods
export type RxProjectionDocMethods = {};

// Static ORM-method for the collection
export type RxProjectionCollectionMethods = {};

export type RxProjectionDocument = RxDocument<
  RxProjectionDocumentType,
  RxProjectionDocMethods,
  RxProjectionCollectionMethods
>;

export type RxProjectionCollection = RxCollection<
  RxProjectionDocumentType,
  RxProjectionDocMethods,
  RxProjectionCollectionMethods
>;
