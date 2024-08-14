import { Injectable } from '@angular/core';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxReplicationState } from 'rxdb/dist/types/plugins/replication';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { environment } from 'src/environments/environment';
import {
  collectionSettings,
  DATABASE_NAME,
  RxTstatsCollections,
  RxTstatsDatabase,
} from '../config';
import { replicationStateProjections } from '../models/projection.schema';

function doSync(): boolean {
  if (window.location.hash == '#nosync') {
    return false;
  }
  return true;
}

/**
 * creates the database
 */
async function _create(password: string): Promise<RxTstatsDatabase> {
  console.log('DatabaseService: creating database..');

  if (!environment.production) {
    await import('rxdb/plugins/dev-mode').then((module) =>
      addRxPlugin(module.RxDBDevModePlugin),
    );
  }

  const passwordObject = {
    algorithm: 'AES-CTR',
    password,
  };

  const db = await createRxDatabase<RxTstatsCollections>({
    name: DATABASE_NAME,
    storage: getRxStorageDexie(), //storage -> indexed db
    password: passwordObject,
  });
  console.log('DatabaseService: created database');

  if (!environment.production) {
    // in dev, write to window for debugging
    (window as any)['db'] = db;
  }

  // create collections

  console.log('DatabaseService: create collections');
  await db.addCollections(collectionSettings);

  console.log('DatabaseService: created');

  return db;
}

let initState: null | Promise<any> = null;
let DB_INSTANCE: RxTstatsDatabase;

/**
 * This is run via APP_INITIALIZER or from where do we want to start the database
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase(password: string) {
  /**
   * When server side rendering is used,
   * The database might already be there
   */
  if (!initState) {
    console.log('initDatabase()');
    initState = _create(password).then((db) => (DB_INSTANCE = db));
  }
  await initState;
  initReplication();
}
async function initReplication() {
  if (!doSync()) {
    console.warn('DatabaseService: sync disabled');
    return;
  }
  let replicationsActive: RxReplicationState<
    any, // data type
    {
      id: string;
      updatedAt: number;
    } // checkpoint type
  >[] = [];

  console.log('DatabaseService: start ongoing replication');

  replicationsActive.push(replicationStateProjections(DB_INSTANCE.projections));
}

@Injectable({ providedIn: 'root' })
export class RxdbDatabaseService {
  get db(): RxTstatsDatabase {
    return DB_INSTANCE;
  }
}
