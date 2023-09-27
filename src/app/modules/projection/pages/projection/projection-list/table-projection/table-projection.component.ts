import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Projection } from 'src/app/modules/projection/model/projection';

export interface TableColumn {
  name: string;
}

@Component({
  selector: 'app-table-projection',
  templateUrl: './table-projection.component.html',
})
export class TableProjectionComponent {
  @Input() rows!: Projection[];
  @Output() deleteEvent = new EventEmitter<number>();

  router = inject(Router);

  columns: TableColumn[] = [
    { name: 'Symbol' },
    { name: 'Direction' },
    { name: 'Date' },
    { name: 'Timeframe' },
    { name: 'Status' },
    { name: 'Actions' },
  ];

  gotoEditProjection(projId: number, event: any) {
    event.stopPropagation();
    this.router.navigate([`/projections/edit/${projId}`]);
  }

  deleteProjection(projId: number, event: any) {
    event.stopPropagation();
    this.deleteEvent.emit(projId);
  }
}
