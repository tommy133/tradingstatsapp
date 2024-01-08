import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import { Projection } from '../../../model/projection';
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

  filteredProjectionsByTrimester$ = this.activatedRoute.queryParams.pipe(
    map((quarters) => ({
      q1: quarters['q1'] === 'true',
      q2: quarters['q2'] === 'true',
      q3: quarters['q3'] === 'true',
      q4: quarters['q4'] === 'true',
    })),
  );

  year$ = this.activatedRoute.queryParams.pipe(
    map((queryParams) => queryParams['year']),
  );

  filteredProjections$ = combineLatest([
    this.filteredProjectionsByName$,
    this.filteredProjectionsByTrimester$,
    this.year$,
  ]).pipe(
    map(([projections, quarters, year]) => {
      return projections.filter((projection) => {
        if (projection.date) {
          const operationDate = new Date(projection.date);
          const quarter = Math.floor(operationDate.getMonth() / 3) + 1;
          return (
            (quarters as { [key: string]: boolean })[`q${quarter}`] &&
            operationDate.getFullYear() == year
          );
        }
        return false;
      });
    }),
  );

  public onDeleteProjection(projection: Projection): void {
    const { id, graph } = projection;
    if (graph) {
      this.fileService.deleteImage(graph);
    }
    this.projectionService.deleteProjection(id);
  }

  onCloseSidebar() {
    this.router.navigate(['.'], { relativeTo: this.activatedRoute });
  }
}
