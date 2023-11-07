import { trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FileService } from 'src/app/core/service/file.service';
import { FormService } from 'src/app/core/service/form.service';
import {
  sidebarRightAnimationSlide,
  SidebarRightAnimationState,
} from 'src/app/shared/utils/sidebar-right-animation';
import { Projection } from '../../../model/projection';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
  animations: [trigger('sidebarRightInOut', sidebarRightAnimationSlide)],
})
export class ProjectionListComponent {
  private projectionService = inject(ProjectionService);
  private formService = inject(FormService);
  private fileService = inject(FileService);

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

  sidebarRightAnimationState: SidebarRightAnimationState = 'out';

  public onDeleteProjection(projection: Projection): void {
    const { id, graph } = projection;
    if (graph) {
      this.fileService.deleteImage(graph);
    }
    this.projectionService.deleteProjection(id);
  }
}
