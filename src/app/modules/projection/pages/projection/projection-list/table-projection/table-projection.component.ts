import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TouchableStatusService } from 'src/app/core/service/touchable-status.service';
import { Projection } from 'src/app/modules/projection/model/projection';
import { getUpdownLabel } from 'src/app/modules/projection/utils/shared-utils';
import {
  getStatusColorClass,
  navigatePreservingQueryParams,
} from 'src/app/shared/utils/shared-utils';

export interface TableColumn {
  name: string;
}

@Component({
  selector: 'app-table-projection',
  templateUrl: './table-projection.component.html',
  styles: [
    `
      .cell {
        @apply p-4 text-center flex-1 whitespace-nowrap;
      }
    `,
  ],
})
export class TableProjectionComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  getStatusColorClass = getStatusColorClass;
  getUpdownLabel = getUpdownLabel;

  isTouchable = TouchableStatusService.isTouchable;

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
