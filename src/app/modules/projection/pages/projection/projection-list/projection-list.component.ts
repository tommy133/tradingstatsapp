import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable, shareReplay, startWith } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { FilterFormService } from '../../../service/filter-form.service';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
})
export class ProjectionListComponent implements OnInit {
  private projectionService = inject(ProjectionService);
  private formService = inject(FormService);
  private fileService = inject(FileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private filterFormService = inject(FilterFormService);

  ngOnInit() {
    this.filterFormService.resetForm();
  }

  projections$ = this.projectionService.projections$;
  searchProjectionsControl = new FormControl<string>('');
  searchProjections$ = this.formService.applyDebounceOnSearch(
    this.searchProjectionsControl.valueChanges,
  );

  filteredProjectionsByName$ = this.formService.filterItems(
    this.projections$,
    this.searchProjections$,
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

  filterForm$ = this.filterFormService.filtersForm.valueChanges.pipe(
    startWith(null),
    shareReplay(1),
  );

  filteredProjections$ = combineLatest([
    this.filteredProjectionsByName$,
    this.quarters$,
    this.year$,
    this.filterForm$,
  ]).pipe(
    map(([projections, quarters, year, filterForm]) => {
      const filteredByPeriod = projections.filter((projection) => {
        if (projection.date) {
          const operationDate = new Date(projection.date);
          const quarter = Math.floor(operationDate.getMonth() / 3) + 1;
          return (
            (quarters as { [key: string]: boolean })[`q${quarter}`] &&
            operationDate.getFullYear() === year
          );
        }
        return false;
      });

      if (!filterForm) return filteredByPeriod;

      return filteredByPeriod.filter((projection) => {
        const { orderType, status, timeframe, market } = filterForm;
        const checkNullSelectControl: (
          input: string | null | undefined,
        ) => boolean = FilterFormService.checkNullSelectControl;
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
          : projection.market.id_mkt === parseInt(market!);
        return checkOrderType && checkStatus && checkTimeframe && checkMarket;
      });
    }),
  );

  goToAdd() {
    navigatePreservingQueryParams(['add'], this.router, this.activatedRoute);
  }

  public onDeleteProjection(projection: Projection): void {
    const { id, graph } = projection;
    if (graph) {
      this.fileService.deleteImage(graph);
    }
    this.projectionService.deleteProjection(id);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }
}
