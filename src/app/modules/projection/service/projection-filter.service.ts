import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, shareReplay, startWith } from 'rxjs';
import { Projection } from '../model/projection';
import { ProjectionFilterFormService } from './projection-filter-form.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectionFilterService {
  private activatedRoute = inject(ActivatedRoute);
  private projectionFilterFormService = inject(ProjectionFilterFormService);

  readonly DEFAULT_STATUS = '3'; //WATCHING

  private quarters$ = this.activatedRoute.queryParams.pipe(
    map((quarters) => ({
      q1: quarters['q1'] === 'true',
      q2: quarters['q2'] === 'true',
      q3: quarters['q3'] === 'true',
      q4: quarters['q4'] === 'true',
    })),
  );

  private year$: Observable<number> = this.activatedRoute.queryParams.pipe(
    map((queryParams) => parseInt(queryParams['year'])),
  );

  private filterForm$ =
    this.projectionFilterFormService.filtersForm.valueChanges.pipe(
      startWith({
        orderType: null,
        timeframe: null,
        status: this.DEFAULT_STATUS,
        market: null,
      }),
      shareReplay(1),
    );

  public getFilteredProjections(
    initialList$: Observable<Projection[]>,
  ): Observable<Projection[]> {
    return combineLatest([
      initialList$,
      this.quarters$,
      this.year$,
      this.filterForm$,
    ]).pipe(
      map(([projections, quarters, year, filterForm]) => {
        const filteredByPeriod = projections.filter(
          (projection: Projection) => {
            if (projection.date) {
              const projectionDate = new Date(projection.date);
              const quarter = Math.floor(projectionDate.getMonth() / 3) + 1;

              if (!quarters.q1 && !quarters.q2 && !quarters.q3 && !quarters.q4)
                return projectionDate.getFullYear() === year;

              return (
                (quarters as { [key: string]: boolean })[`q${quarter}`] &&
                projectionDate.getFullYear() === year
              );
            }
            return false;
          },
        );

        if (!filterForm) return filteredByPeriod;

        return filteredByPeriod.filter((projection: Projection) => {
          const { orderType, status, timeframe, market } = filterForm;
          const checkNullSelectControl: (
            input: string | null | undefined,
          ) => boolean = ProjectionFilterFormService.checkNullSelectControl;
          const checkOrderType = checkNullSelectControl(orderType)
            ? true
            : projection.updown === parseInt(orderType!);
          const checkStatus = checkNullSelectControl(status)
            ? true
            : projection.status.id_st === parseInt(status!);
          const checkTimeframe = checkNullSelectControl(timeframe)
            ? true
            : projection.timeframe === timeframe;
          const checkMarket = checkNullSelectControl(market)
            ? true
            : projection.symbol.market.id_mkt === parseInt(market!);
          return checkOrderType && checkStatus && checkTimeframe && checkMarket;
        });
      }),
    );
  }
}
