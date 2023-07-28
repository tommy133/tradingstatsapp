import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Projection } from 'src/app/modules/projection/model/projection';

export interface TableColumn {
  name: string;
}

@Component({
  selector: 'app-table-projection',
  templateUrl: './table-projection.component.html',
})
export class TableProjectionComponent {
  @Input() rows?: Projection[] | null;
  @Output() deleteEvent = new EventEmitter<number>();

  columns: TableColumn[] = [
    { name: 'Symbol' },
    { name: 'Direction' },
    { name: 'Date' },
    { name: 'Timeframe' },
    { name: 'Status' },
    { name: 'Actions' },
  ];

  deleteProjection(projId: number) {
    this.deleteEvent.emit(projId);
  }
}
