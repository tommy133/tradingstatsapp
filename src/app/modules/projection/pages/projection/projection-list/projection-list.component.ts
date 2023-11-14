import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  filteredProjections$ = this.formService.filterItems(
    this.projections$,
    this.searchProjections$,
    ({ symbol }) => symbol.name_sym,
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
