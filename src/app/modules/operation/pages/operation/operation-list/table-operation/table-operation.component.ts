import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Operation } from 'src/app/modules/operation/model/operation';

export interface TableColumn {
  name: string;
}

@Component({
  selector: 'app-table-operation',
  templateUrl: './table-operation.component.html',
})
export class TableOperationComponent {
  @Input() rows!: Operation[];
  @Output() deleteEvent = new EventEmitter<number>();

  columns: TableColumn[] = [
    { name: 'Symbol' },
    { name: 'Direction' },
    { name: 'Date open' },
    { name: 'Date close' },
    { name: 'Timeframe' },
    { name: 'Points' },
    { name: 'Actions' },
  ];

  getPointsColorClass(points: number): string {
    return points > 0 ? 'text-green' : 'text-red';
  }

  deleteProjection(projId: number) {
    this.deleteEvent.emit(projId);
  }
}
