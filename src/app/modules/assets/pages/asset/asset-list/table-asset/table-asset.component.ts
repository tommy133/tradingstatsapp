import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Symbol } from 'src/app/modules/assets/model/symbol';
import { Operation } from 'src/app/modules/operation/model/operation';
import { OperationService } from 'src/app/modules/operation/service/operation.service';
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
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private operationService = inject(OperationService);

  @Input() rows!: Symbol[];
  @Output() deleteEvent = new EventEmitter<number>();

  columns: TableColumn[] = [
    { name: 'Symbol name' },
    { name: 'Market' },
    { name: 'Number trades' },
    { name: 'Hit ratio' },
    { name: 'Actions' },
  ];

  operations: Operation[] = [];

  async ngOnInit() {
    this.operations = await firstValueFrom(this.operationService.operations$);
  }

  getNumberOfTrades(symbolId: number) {
    return this.operations.filter((op) => op.symbol.id_sym === symbolId).length;
  }

  getHitRatio(symbolId: number) {
    const n_trades = this.getNumberOfTrades(symbolId);
    const n_profit_trades = this.operations.filter(
      (op) => op.symbol.id_sym === symbolId && (op.revenue ?? 0) > 0,
    ).length;

    if (n_trades === 0) return '-';
    return (n_profit_trades / n_trades).toFixed(2);
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
