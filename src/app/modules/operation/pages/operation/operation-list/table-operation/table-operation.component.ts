import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Operation } from 'src/app/modules/operation/model/operation';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';

export interface TableColumn {
  name: string;
}

@Component({
  selector: 'app-table-operation',
  templateUrl: './table-operation.component.html',
})
export class TableOperationComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  @Input() rows!: Operation[];
  @Output() deleteEvent = new EventEmitter<Operation>();

  columns: TableColumn[] = [
    { name: 'Symbol' },
    { name: 'Direction' },
    { name: 'Date open' },
    { name: 'Date close' },
    { name: 'Timeframe' },
    { name: 'Status' },
    { name: 'Revenue' },
    { name: 'Actions' },
  ];

  getRevenueColorClass(revenue: number): string {
    return revenue > 0 ? 'text-green' : 'text-red';
  }

  getStatusColorClass(status: number) {
    switch (status) {
      case 1: return 'text-blue-300'
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

  gotoEditOperation(operationId: number, event: any) {
    event.stopPropagation();
    navigatePreservingQueryParams(
      [`/operations/${operationId}/edit`],
      this.router,
      this.activatedRoute,
    );
  }

  goToChart(operationId: number, event: any) {
    event.stopPropagation();
    navigatePreservingQueryParams(
      ['view-chart', operationId],
      this.router,
      this.activatedRoute,
    );
  }

  deleteOperation(operation: Operation, event: any) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this operation?')) {
      this.deleteEvent.emit(operation);
    }
  }
}
