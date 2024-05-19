import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { Symbol } from 'src/app/modules/assets/model/symbol';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styles: [
    `
      .row {
        @apply flex items-center justify-between;
      }
    `,
  ],
})
export class AssetDetailsComponent implements OnInit {
  private assetService = inject(SymbolService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  asset$?: Observable<Symbol>;

  ngOnInit() {
    this.asset$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.assetService.getSymbol(id);
      }),
    );
  }

  onDeleteAsset(assetId: number): void {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.assetService.deleteSymbol(assetId);
      this.goBackDelete();
    }
  }

  goToEdit(assetId: number) {
    navigatePreservingQueryParams(
      ['../' + assetId, 'edit'],
      this.router,
      this.activatedRoute,
    );
  }

  goBackDelete() {
    navigatePreservingQueryParams(['..'], this.router, this.activatedRoute);
  }
}
