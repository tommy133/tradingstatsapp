import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, shareReplay } from 'rxjs';
import { BookmarkService } from 'src/app/core/service/bookmark.service';
import { FormService } from 'src/app/core/service/form.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { ProjectionFilterFormService } from '../../../service/projection-filter-form.service';
import { ProjectionFilterService } from '../../../service/projection-filter.service';
import { ProjectionService } from '../../../service/projection.service';

const timeframeOrder: { [key: string]: number } = {
  M1: 1,
  M5: 2,
  M15: 3,
  M30: 4,
  H1: 5,
  H4: 6,
  D: 7,
  W: 8,
  M: 9,
};

const urgencyOrder: { [key: string]: number } = {
  TRIGGER: 1,
  WATCHING: 2,
  EXPIRED: 3,
};

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
})
export class ProjectionListComponent implements AfterViewInit {
  private projectionService = inject(ProjectionService);
  private formService = inject(FormService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private projectionFilter = inject(ProjectionFilterService);
  private projectionFilterFormService = inject(ProjectionFilterFormService);
  private bookmarkService = inject(BookmarkService);
  private toastService = inject(ToastService);

  private projections$ = this.projectionService.projections$.pipe(
    shareReplay(1),
  );
  searchProjectionsControl = new FormControl<string>('');
  private searchProjections$ = this.formService.applyDebounceOnSearch(
    this.searchProjectionsControl.valueChanges,
  );
  isSearchActive$ = this.searchProjectionsControl.valueChanges.pipe(
    map((search) => (search?.length ?? 0) > 0),
  );

  private filteredProjectionsByName$ = this.formService.filterItems(
    this.projections$,
    this.searchProjections$,
    ({ symbol }) => symbol.name_sym,
  );

  private filteredProjections$ = this.projectionFilter.getFilteredProjections(
    this.filteredProjectionsByName$,
  );

  orderBySelect = new FormControl<string>('');
  ngAfterViewInit() {
    this.orderBySelect.setValue('Timeframe'); //default projection ordered by timeframe
  }

  orderedProjections$ = combineLatest([
    this.orderBySelect.valueChanges,
    this.filteredProjections$,
  ]).pipe(
    map(([orderBy, projections]) => {
      if (orderBy === 'Timeframe') {
        const unsortedProjections = [...projections];
        return unsortedProjections.sort(
          (a, b) => timeframeOrder[a.timeframe] - timeframeOrder[b.timeframe],
        );
      }
      if (orderBy === 'Urgency') {
        const unsortedProjections = [...projections];
        return unsortedProjections.sort(
          (a, b) =>
            urgencyOrder[a.status.name_st] - urgencyOrder[b.status.name_st],
        );
      }

      return projections; //assume it comes already sorted by date from backend
    }),
  );

  n_projections$ = this.filteredProjections$.pipe(map((projs) => projs.length));

  goToBookmark() {
    const bookmark = this.bookmarkService.getBookmark(true);

    if (bookmark) {
      this.router.navigateByUrl(bookmark);
    } else {
      this.toastService.info({
        message: 'No bookmark available',
      });
    }
  }
  goToAdd() {
    navigatePreservingQueryParams(['add'], this.router, this.activatedRoute);
  }

  public onDeleteProjection(projection: Projection): void {
    this.projectionService.deleteProjection(projection);
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }

  resetFilterForm() {
    this.projectionFilterFormService.resetForm();
  }
}
