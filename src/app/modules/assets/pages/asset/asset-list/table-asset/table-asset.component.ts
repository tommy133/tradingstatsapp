import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TouchableStatusService } from 'src/app/core/service/touchable-status.service';
import { Symbol } from 'src/app/modules/assets/model/symbol';
import { Operation } from 'src/app/modules/operation/model/operation';
import { OperationService } from 'src/app/modules/operation/service/operation.service';
import { Projection } from 'src/app/modules/projection/model/projection';
import { ProjectionService } from 'src/app/modules/projection/service/projection.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';

interface TableColumn {
  name: string;
}

@Component({
  selector: 'app-table-asset',
  templateUrl: './table-asset.component.html',
  styles: [
    `
      .cell {
        @apply p-4 text-center flex-1 whitespace-nowrap;
      }
    `,
  ],
})
export class TableAssetComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly projectionService = inject(ProjectionService);
  private readonly operationService = inject(OperationService);

  isTouchable = TouchableStatusService.isTouchable;

  @Input() rows!: Symbol[];
  @Output() deleteEvent = new EventEmitter<number>();

  columns: TableColumn[] = [
    { name: 'Symbol name' },
    { name: 'Market' },
    { name: 'Projections' },
    { name: 'Operations' },
    { name: 'Backtest checkpoint' },
    { name: 'Actions' },
  ];

  projections: Projection[] = [];
  operations: Operation[] = [];

  async ngOnInit() {
    this.projections = await firstValueFrom(
      this.projectionService.projections$,
    );
    this.operations = await firstValueFrom(this.operationService.operations$);
  }

  getNumberOfProjections(symbolId: number) {
    return this.projections.filter((p) => p.symbol.id_sym === symbolId).length;
  }

  getNumberOfOperations(symbolId: number) {
    return this.operations.filter((op) => op.symbol.id_sym === symbolId).length;
  }

  goToDetails(symbolId: number) {
    navigatePreservingQueryParams(
      ['.', symbolId],
      this.router,
      this.activatedRoute,
    );
  }

  gotoEditAsset(symbolId: number, event: any) {
    event.stopPropagation();
    navigatePreservingQueryParams(
      [`/assets/${symbolId}/edit`],
      this.router,
      this.activatedRoute,
    );
  }

  deleteAsset(symbolId: number, event: any) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this symbol?')) {
      this.deleteEvent.emit(symbolId);
    }
  }
}
