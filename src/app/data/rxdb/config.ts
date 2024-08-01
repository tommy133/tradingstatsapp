import { RxDatabase } from 'rxdb';
import {
  PROJECTION_COLLECTION_NAME,
  PROJECTION_SCHEMA,
  RxProjectionCollection,
} from './models/projection.schema';

export const DATABASE_NAME = 'db';

export type RxTstatsCollections = {
  [PROJECTION_COLLECTION_NAME]: RxProjectionCollection;
};
export type RxTstatsDatabase = RxDatabase<RxTstatsCollections>;
export const collectionSettings = {
  [PROJECTION_COLLECTION_NAME]: {
    schema: PROJECTION_SCHEMA,
    methods: {},
    statics: {},
    sync: true,
  },
};
