import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projection } from 'src/app/modules/projection/model/projection';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';

export interface TableColumn {
  name: string;
}

@Component({
  selector: 'app-table-projection',
  templateUrl: './table-projection.component.html',
})
export class TableProjectionComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  @Input() rows!: Projection[];
  @Output() deleteEvent = new EventEmitter<Projection>();

  columns: TableColumn[] = [
    { name: 'Symbol' },
    { name: 'Direction' },
    { name: 'Date' },
    { name: 'Timeframe' },
    { name: 'Status' },
    { name: 'Actions' },
  ];

  getStatusColorClass(status: number) {
    switch (status) {
      case 3: return 'text-yellow-300'
      default: return ''
    }
  }


  goToDetails(operationId: number) {
    navigatePreservingQueryParams(
      ['.', operationId],
      this.router,
      this.activatedRoute,
    );
  }

  gotoEditProjection(projId: number, event: any) {
    event.stopPropagation();
    navigatePreservingQueryParams(
      [`/projections/edit/${projId}`],
      this.router,
      this.activatedRoute,
    );
  }

  goToChart(projectionId: number, event: any) {
    event.stopPropagation();
    navigatePreservingQueryParams(
      ['view-chart', projectionId],
      this.router,
      this.activatedRoute,
    );
  }

  deleteProjection(projection: Projection, event: any) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this projection?')) {
      this.deleteEvent.emit(projection);
    }
  }
}
