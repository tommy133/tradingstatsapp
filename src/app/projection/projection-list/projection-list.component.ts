import { Component } from '@angular/core';
import { TableData } from './table/table.component';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
  styleUrls: ['./projection-list.component.css'],
})
export class ProjectionListComponent {
  constructor() {}

  mockTableData: TableData = {
    rows: [
      {
        id: 1,
        symbol: 'EURUSD',
        date: '01/01/97',
        timeframe: 'M1',
        status: 'ACTIVE',
      },
      {
        id: 2,
        symbol: 'USDJPY',
        date: '01/01/97',
        timeframe: 'M1',
        status: 'ACTIVE',
      },
    ],
    columns: [
      {
        name: 'Symbol',
      },
      {
        name: 'Date',
      },
      {
        name: 'Timeframe',
      },
      {
        name: 'Status',
      },
    ],
  };
}
