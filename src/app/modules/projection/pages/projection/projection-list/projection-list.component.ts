import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { ProjectionFilterFormService } from '../../../service/projection-filter-form.service';
import { ProjectionFilterService } from '../../../service/projection-filter.service';
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
