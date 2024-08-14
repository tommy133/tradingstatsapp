import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from 'rxdb';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import { environment } from 'src/environments/environment';

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
      maxLength: 4,
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
export const replicationStateProjections = (
  collection: RxProjectionCollection,
) =>
  replicateRxCollection({
    collection: collection,
    replicationIdentifier: 'pull-projections',
    live: false,

    retryTime: 5 * 1000,

    waitForLeadership: true,

    autoStart: true,
    deletedField: 'deleted',
    pull: {
      async handler(checkpointOrNull: any, batchSize: any) {
        const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : 0;
        const id = checkpointOrNull ? checkpointOrNull.id : '';
        const response = await fetch(
          `${environment.apiBaseUrl}/projections/pull?updatedAt=${updatedAt}&id=${id}&limit=${batchSize}`,
        );
        const data = await response.json();

        return {
          documents: data.documents,
          checkpoint: data.checkpoint,
        };
      },
      batchSize: 10,

      modifier: (d) => d,
    },
  });
