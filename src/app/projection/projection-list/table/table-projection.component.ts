import { Component, Input } from '@angular/core';

export interface TableColumn {
  name: string;
}

export interface TableRow {
  id: number;
  symbol: string;
  date: string;
  timeframe: string;
  status: string;
}

export interface TableData {
  rows: TableRow[];
  columns: TableColumn[];
}

@Component({
  selector: 'app-table',
  templateUrl: './table-projection.component.html',
})
export class TableProjectionComponent {
  @Input() tableData!: TableData;
  constructor() {}
}
