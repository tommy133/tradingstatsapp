import { Component, inject } from '@angular/core';
import {
  initDatabase,
  RxdbDatabaseService as RxDB,
} from './data/rxdb/service/rxdb-database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private rxDb = inject(RxDB);

  title = 'tradingstatsapp';
  constructor() {
    initDatabase('');
    this.rxDb.db.projections.$.subscribe(console.log);
  }
}
