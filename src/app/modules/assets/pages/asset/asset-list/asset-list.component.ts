import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  combineLatest,
  firstValueFrom,
  map,
  shareReplay,
  startWith,
} from 'rxjs';
import { FormService } from 'src/app/core/service/form.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { Operation } from 'src/app/modules/operation/model/operation';
import { OperationService } from 'src/app/modules/operation/service/operation.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { AssetFilterFormService } from '../../../service/asset-filter-form.service';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styles: [],
})
export class AssetListComponent implements AfterViewInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private assetService = inject(SymbolService);
  private formService = inject(FormService);
  private assetFilterFormService = inject(AssetFilterFormService);
  private operationService = inject(OperationService);

  private assets$ = this.assetService.assets$.pipe(shareReplay(1));
  searchAssetsControl = new FormControl<string>('');
  orderBySelect = new FormControl<string>('');
  ngAfterViewInit() {
    this.orderBySelect.setValue('btCheckpoint'); //default assets ordered by backtest checkpoint
  }

  operations: Operation[] = [];

  async ngOnInit() {
    this.operations = await firstValueFrom(this.operationService.operations$);
  }

  private searchAssets$ = this.formService.applyDebounceOnSearch(
    this.searchAssetsControl.valueChanges,
  );
  isSearchActive$ = this.searchAssetsControl.valueChanges.pipe(
    map((search) => (search?.length ?? 0) > 0),
  );

  private filteredAssetsByName$ = this.formService.filterItems(
    this.assets$,
    this.searchAssets$,
    ({ name_sym }) => name_sym,
  );

  private filteredAssetsByDescription$ = this.formService.filterItems(
    this.assets$,
    this.searchAssets$,
    ({ description }) => description ?? '',
  );

  private filterForm$ =
    this.assetFilterFormService.filtersForm.valueChanges.pipe(
      startWith(null),
      shareReplay(1),
    );

  private filteredAssets$ = combineLatest([
    this.filteredAssetsByName$,
    this.filteredAssetsByDescription$,
    this.filterForm$,
  ]).pipe(
    map(([assetsByName, assetsByDescription, filterForm]) => {
      const assets = [...assetsByName, ...assetsByDescription];
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

  orderedAssets$ = combineLatest([
    this.orderBySelect.valueChanges,
    this.filteredAssets$,
  ]).pipe(
    map(([orderBy, assets]) => {
      const unsortedAssets = [...assets];
      switch (orderBy) {
        case 'btCheckpoint':
          return unsortedAssets.sort(
            (a, b) =>
              new Date(a.bt_checkpoint ?? 0).getTime() -
              new Date(b.bt_checkpoint ?? 0).getTime(),
          );
        case 'nTrades':
        default:
          return unsortedAssets.sort(
            (a, b) =>
              this.getNumberOfTrades(b.id_sym) -
              this.getNumberOfTrades(a.id_sym),
          );
      }
    }),
  );

  n_assets$ = this.filteredAssets$.pipe(map((ass) => ass.length));

  goToAdd() {
    navigatePreservingQueryParams(['add'], this.router, this.activatedRoute);
  }

  onDeleteAsset(symbolId: number) {
    this.assetService.deleteSymbol(symbolId);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }

  getNumberOfTrades(symbolId: number) {
    return this.operations.filter((op) => op.symbol.id_sym === symbolId).length;
  }

  resetFilterForm() {
    this.assetFilterFormService.resetForm();
  }
}
