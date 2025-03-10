import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Status } from 'src/app/data/models/status';
import { Timeframe } from 'src/app/data/models/timeframe';
import { MarketService } from 'src/app/data/service/market.service';
import { StatusService } from 'src/app/data/service/status.service';
import { ProjectionFilterFormService } from 'src/app/modules/projection/service/projection-filter-form.service';
import { ProjectionService } from 'src/app/modules/projection/service/projection.service';
@Component({
  selector: 'projection-filters-form',
  templateUrl: './projection-filters-form.component.html',
})
export class ProjectionFiltersFormComponent {
  private filterFormService = inject(ProjectionFilterFormService);
  private statusService = inject(StatusService);
  private marketService = inject(MarketService);

  timeframes = Object.values(Timeframe).filter(
    (value) => typeof value !== 'number',
  );

  orderTypeControl = this.filterFormService.orderType;
  timeframeControl = this.filterFormService.timeframe;
  statusControl = this.filterFormService.status;
  marketControl = this.filterFormService.market;

  statuses$: Observable<Status[]> = this.statusService.statuses$.pipe(
    map((statuses) =>
      statuses.filter((status) =>
        ProjectionService.PROJECTION_STATUSES.includes(status.name_st),
      ),
    ),
  );

  markets$ = this.marketService.getMarkets();
}
