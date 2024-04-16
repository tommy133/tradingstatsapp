import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable, shareReplay, startWith } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { Operation } from '../../../model/operation';
import { OperationFilterFormService } from '../../../service/operation-filter-form.service';
import { OperationService } from '../../../service/operation.service';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
})
export class OperationListComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private operationService = inject(OperationService);
  private formService = inject(FormService);
  private fileService = inject(FileService);
  private operationFilterFormService = inject(OperationFilterFormService);

  ngOnInit() {
    this.operationFilterFormService.resetForm();
  }

  operations$ = this.operationService.operations$;
  searchOperationsControl = new FormControl<string>('');
  searchOperations$ = this.formService.applyDebounceOnSearch(
    this.searchOperationsControl.valueChanges,
  );
  filteredOperationsByName$ = this.formService.filterItems(
    this.operations$,
    this.searchOperations$,
    ({ symbol }) => symbol.name_sym,
  );

  quarters$ = this.activatedRoute.queryParams.pipe(
    map((quarters) => ({
      q1: quarters['q1'] === 'true',
      q2: quarters['q2'] === 'true',
      q3: quarters['q3'] === 'true',
      q4: quarters['q4'] === 'true',
    })),
  );

  year$: Observable<number> = this.activatedRoute.queryParams.pipe(
    map((queryParams) => parseInt(queryParams['year'])),
  );

  filterForm$ = this.operationFilterFormService.filtersForm.valueChanges.pipe(
    startWith(null),
    shareReplay(1),
  );

  filteredOperations$ = combineLatest([
    this.filteredOperationsByName$,
    this.quarters$,
    this.year$,
    this.filterForm$,
  ]).pipe(
    map(([operations, quarters, year, filterForm]) => {
      const filteredByPeriod = operations.filter((operation) => {
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

      return filteredByPeriod.filter((operation) => {
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
          : operation.market.id_mkt === parseInt(market!);

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
          checkNullSelectControl(result) ||
          operation.revenue == null ||
          operation.revenue == undefined
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

  goToAdd() {
    navigatePreservingQueryParams(['add'], this.router, this.activatedRoute);
  }

  public onDeleteOperation(operation: Operation): void {
    const { id, graph } = operation;
    if (graph) {
      this.fileService.deleteImage(graph);
    }
    this.operationService.deleteOperation(id);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }

  resetFilterForm() {
    this.operationFilterFormService.resetForm();
  }
}
