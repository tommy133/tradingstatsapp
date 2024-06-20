import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, shareReplay } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
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

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
})
export class ProjectionListComponent implements AfterViewInit {
  private projectionService = inject(ProjectionService);
  private formService = inject(FormService);
  private fileService = inject(FileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private projectionFilter = inject(ProjectionFilterService);
  private projectionFilterFormService = inject(ProjectionFilterFormService);

  projections$ = this.projectionService.projections$.pipe(shareReplay(1));
  searchProjectionsControl = new FormControl<string>('');
  searchProjections$ = this.formService.applyDebounceOnSearch(
    this.searchProjectionsControl.valueChanges,
  );
  isSearchActive$ = this.searchProjectionsControl.valueChanges.pipe(
    map((search) => (search?.length ?? 0) > 0),
  );

  filteredProjectionsByName$ = this.formService.filterItems(
    this.projections$,
    this.searchProjections$,
    ({ symbol }) => symbol.name_sym,
  );

  filteredProjections$ = this.projectionFilter.getFilteredProjections(
    this.filteredProjectionsByName$,
  );
  orderBySelect = new FormControl<string>('');
  ngAfterViewInit() {
    this.orderBySelect.setValue('Date');
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

      return projections;
    }),
  );
  n_projections$ = this.filteredProjections$.pipe(map((projs) => projs.length));

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
