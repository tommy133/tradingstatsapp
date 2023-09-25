import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingService } from 'src/app/core/service/routing.service';
import { Operation } from 'src/app/modules/operation/model/operation';

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
  private routingService = inject(RoutingService);

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

  goToDetails(operationId: number) {
    this.routingService.navigatePreservingQueryParams(
      ['.', operationId],
      this.router,
      this.activatedRoute,
    );
  }

  gotoEditOperation(operationId: number, event: any) {
    event.stopPropagation();
    this.router.navigate([`/operations/edit/${operationId}`]);
  }

  deleteOperation(operationId: number) {
    this.deleteEvent.emit(operationId);
  }
}
