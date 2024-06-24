import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, shareReplay, startWith } from 'rxjs';
import { Operation } from '../model/operation';
import { OperationFilterFormService } from './operation-filter-form.service';

@Injectable({
  providedIn: 'root',
})
export class OperationFilterService {
  private activatedRoute = inject(ActivatedRoute);
  private operationFilterFormService = inject(OperationFilterFormService);

  private account$ = this.activatedRoute.queryParams.pipe(
    map((params) => params['account'])
  )

  private quarters$ = this.activatedRoute.queryParams.pipe(
    map((quarters) => ({
      q1: quarters['q1'] === 'true',
      q2: quarters['q2'] === 'true',
      q3: quarters['q3'] === 'true',
      q4: quarters['q4'] === 'true',
    })),
  );

  private year$ = this.activatedRoute.queryParams.pipe(
    map((queryParams) => parseInt(queryParams['year'])),
  );

  filterForm$ = this.operationFilterFormService.filtersForm.valueChanges.pipe(
    startWith(null),
    shareReplay(1),
  );

  public getFilteredOperations(initialList$: Observable<Operation[]>) {
    return combineLatest([
      initialList$,
      this.account$,
      this.quarters$,
      this.year$,
      this.filterForm$,
    ]).pipe(
      map(([operations, accountId, quarters, year, filterForm]) => {
        const filteredByAccount = accountId ? operations.filter(
          (operation) => operation.account.id_ac.toString() === accountId,
        ) : operations
        const filteredByPeriod = filteredByAccount.filter((operation) => {
          if (operation.dateOpen) {
            const operationDate = new Date(operation.dateOpen);
            const quarter = Math.floor(operationDate.getMonth() / 3) + 1;

            if (!quarters.q1 && !quarters.q2 && !quarters.q3 && !quarters.q4)
              return operationDate.getFullYear() === year;

            return (
              (quarters as { [key: string]: boolean })[`q${quarter}`] &&
              operationDate.getFullYear() === year
            );
          }
          return false;
        });

        if (!filterForm) return filteredByPeriod;

        return filteredByPeriod.filter((operation: Operation) => {
          const { orderType, status, timeframe, market, result } = filterForm;
          const checkNullSelectControl: (
            input: string | null | undefined,
          ) => boolean = OperationFilterFormService.checkNullSelectControl;
          const checkOrderType = checkNullSelectControl(orderType)
            ? true
            : operation.updown === parseInt(orderType!);
          const checkStatus = checkNullSelectControl(status)
            ? true
            : operation.status.id_st === parseInt(status!);
          const checkTimeframe = checkNullSelectControl(timeframe)
            ? true
            : operation.timeframe === timeframe;
          const checkMarket = checkNullSelectControl(market)
            ? true
            : operation.symbol.market.id_mkt === parseInt(market!);

          const checkOperationRevenue = (
            result: string | null | undefined,
            operation: Operation,
          ) => {
            if (operation.revenue) {
              return parseInt(result!)
                ? operation.revenue > 0
                : operation.revenue < 0;
            }
            return;
          };
          const checkResult =
            checkNullSelectControl(result) || !operation.revenue
              ? true
              : checkOperationRevenue(result, operation);

          return (
            checkOrderType &&
            checkStatus &&
            checkTimeframe &&
            checkMarket &&
            checkResult
          );
        });
      }),
    );
  }
}
