import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, shareReplay, startWith } from 'rxjs';
import { FormService } from 'src/app/core/service/form.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { AssetFilterFormService } from '../../../service/asset-filter-form.service';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styles: [],
})
export class AssetListComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private assetService = inject(SymbolService);
  private formService = inject(FormService);
  private assetFilterFormService = inject(AssetFilterFormService);

  assets$ = this.assetService.assets$.pipe(shareReplay(1));
  searchAssetsControl = new FormControl<string>('');
  searchAssets$ = this.formService.applyDebounceOnSearch(
    this.searchAssetsControl.valueChanges,
  );
  filteredAssetsByName$ = this.formService.filterItems(
    this.assets$,
    this.searchAssets$,
    ({ name_sym }) => name_sym,
  );

  filterForm$ = this.assetFilterFormService.filtersForm.valueChanges.pipe(
    startWith(null),
    shareReplay(1),
  );

  constructor() {
    this.filteredAssetsByName$.subscribe(console.log);
  }

  filteredAssets$ = combineLatest([
    this.filteredAssetsByName$,
    this.filterForm$,
  ]).pipe(
    map(([assets, filterForm]) => {
      if (!filterForm) return assets;
      return assets.filter((asset) => {
        const { market } = filterForm;
        const checkMarket = AssetFilterFormService.checkNullSelectControl(
          market,
        )
          ? true
          : asset.market.id_mkt === parseInt(market!);
        return checkMarket;
      });
    }),
  );

  n_assets$ = this.assets$.pipe(map((ass) => ass.length));

  goToAdd() {
    navigatePreservingQueryParams(['add'], this.router, this.activatedRoute);
  }

  onDeleteAsset(symbolId: number) {
    this.assetService.deleteSymbol(symbolId);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }

  resetFilterForm() {
    this.assetFilterFormService.resetForm();
  }
}
