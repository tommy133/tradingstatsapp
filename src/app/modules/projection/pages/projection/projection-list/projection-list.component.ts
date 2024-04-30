import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, map, shareReplay, startWith } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { ProjectionFilterFormService } from '../../../service/projection-filter-form.service';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
})
export class ProjectionListComponent {
  private projectionService = inject(ProjectionService);
  private formService = inject(FormService);
  private fileService = inject(FileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private projectionFilterFormService = inject(ProjectionFilterFormService);
  readonly DEFAULT_STATUS = '3'; //WATCHING

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

  filterForm$ = this.projectionFilterFormService.filtersForm.valueChanges.pipe(
    startWith({
      orderType: null,
      timeframe: null,
      status: this.DEFAULT_STATUS,
      market: null,
    }),
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
      });

      if (!filterForm) return filteredByPeriod;

      return filteredByPeriod.filter((projection) => {
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

  resetFilterForm() {
    this.projectionFilterFormService.resetForm();
  }
}
