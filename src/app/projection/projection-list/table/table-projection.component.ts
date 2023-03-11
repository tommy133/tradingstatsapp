import { Component, Input } from '@angular/core';
import { Projection } from '../../model/projection';

export interface TableColumn {
  name: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table-projection.component.html',
})
export class TableProjectionComponent {
  @Input() rows?: Projection[] | null;
  columns: TableColumn[] = [
    { name: 'Symbol' },
    { name: 'Direction' },
    { name: 'Date' },
    { name: 'Timeframe' },
    { name: 'Status' },
  ];
  constructor() {}
}
