import { Component, inject } from '@angular/core';
import { MarketService } from 'src/app/data/service/market.service';
import { AssetFilterFormService } from 'src/app/modules/assets/service/asset-filter-form.service';

@Component({
  selector: 'asset-filters-form',
  templateUrl: './asset-filters-form.component.html',
})
export class AssetFiltersFormComponent {
  private marketService = inject(MarketService);
  private filterFormService = inject(AssetFilterFormService);

  marketControl = this.filterFormService.market;
  markets$ = this.marketService.getMarkets();
}
