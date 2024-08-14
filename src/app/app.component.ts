import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
  projections$: any;
  title = 'tradingstatsapp';
  async ngOnInit() {
    await initDatabase('');
    this.fetchProjections();
  }

  async fetchProjections() {
    const db = await this.rxDb.db;
    firstValueFrom(db.projections.find().$).then((projections) => {
       
    })
    console.log(await firstValueFrom(db.projections.find().$));
  }
}
