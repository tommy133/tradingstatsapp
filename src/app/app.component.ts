import { Component } from '@angular/core';
import { initDatabase } from './data/rxdb/service/rxdb-database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tradingstatsapp';
  constructor() {
    initDatabase('');
  }
}
