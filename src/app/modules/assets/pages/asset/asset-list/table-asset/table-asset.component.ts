import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Symbol } from 'src/app/modules/assets/model/symbol';
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

  @Input() rows!: Symbol[];
  @Output() deleteEvent = new EventEmitter<Symbol>();

  columns: TableColumn[] = [
    { name: 'Symbol name' },
    { name: 'Market' },
    { name: 'Number trades' },
    { name: 'Hit ratio' },
    { name: 'Actions' },
  ];

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

  deleteAsset(symbol: Symbol, event: any) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this symbol?')) {
      this.deleteEvent.emit(symbol);
    }
  }
}
