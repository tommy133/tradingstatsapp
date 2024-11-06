import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Status } from 'src/app/data/models/status';
import { Timeframe } from 'src/app/data/models/timeframe';
import { MarketService } from 'src/app/data/service/market.service';
import { StatusService } from 'src/app/data/service/status.service';
import { OperationFilterFormService } from 'src/app/modules/operation/service/operation-filter-form.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';

@Component({
  selector: 'operation-filters-form',
  templateUrl: './operation-filters-form.component.html',
})
export class OperationFiltersFormComponent {
  private filterFormService = inject(OperationFilterFormService);
  private statusService = inject(StatusService);
  private marketService = inject(MarketService);

  timeframes = Object.values(Timeframe).filter(
    (value) => typeof value !== 'number',
  );

  orderTypeControl = this.filterFormService.orderType;
  timeframeControl = this.filterFormService.timeframe;
  statusControl = this.filterFormService.status;
  marketControl = this.filterFormService.market;
  resultControl = this.filterFormService.result;
  dateTypeControl = this.filterFormService.dateType;

  statuses$: Observable<Status[]> = this.statusService
    .getStatuses()
    .pipe(
      map((statuses) =>
        statuses.filter((status) =>
          OperationService.OPERATION_STATUSES.includes(status.name_st),
        ),
      ),
    );

  markets$ = this.marketService.getMarkets();
}
