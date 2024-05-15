import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styles: [],
})
export class AssetListComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private assetService = inject(SymbolService);

  assets$ = this.assetService.getSymbols().pipe(shareReplay(1));
  n_assets$ = this.assets$.pipe(map((ass) => ass.length));

  goToAdd() {
    navigatePreservingQueryParams(['add'], this.router, this.activatedRoute);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }
}
