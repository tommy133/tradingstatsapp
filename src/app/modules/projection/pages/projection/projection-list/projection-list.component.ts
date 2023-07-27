import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormService } from 'src/app/core/service/form.service';
import {
  sidebarRightAnimationSlide,
  SidebarRightAnimationState,
} from 'src/app/shared/utils/sidebar-right-animation';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
  animations: [trigger('sidebarRightInOut', sidebarRightAnimationSlide)],
})
export class ProjectionListComponent {
  projections$ = this.projectionService.projections$;
  searchProjectionsControl = new FormControl<string>('');
  searchProjections$ = this.formService.applyDebounceOnSearch(
    this.searchProjectionsControl.valueChanges,
  );
  filteredProjections$ = this.formService.filterItems(
    this.projections$,
    this.searchProjections$,
    ({ symbol }) => symbol.nameSymbol,
  );

  sidebarRightAnimationState: SidebarRightAnimationState = 'out';

  constructor(
    private projectionService: ProjectionService,
    private formService: FormService,
  ) {}

  ngOnInit() {
    this.projectionService.setRefetchInterval();
  }

  public onDeleteProjection(projectionId: number): void {
    this.projectionService.deleteProjection(projectionId);
  }
}
