import { trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormService } from 'src/app/core/service/form.service';
import {
  SidebarRightAnimationState,
  sidebarRightAnimationSlide,
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
    ({ symbol }) => symbol.name_sym,
  );

  sidebarRightAnimationState: SidebarRightAnimationState = 'out';
  trimNum: number = 0;
  constructor(
    private projectionService: ProjectionService,
    private formService: FormService,
  ) {}
  activatedRoute = inject(ActivatedRoute);
  ngOnInit() {
    //this.projectionService.setRefetchInterval();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['period'] === 'q1') {
        this.trimNum = 1;
      } else if (params['period'] === 'q2') {
        this.trimNum = 2;
      } else if (params['period'] === 'q3') {
        this.trimNum = 3;
      } else if (params['period'] === 'q4') {
        this.projectionService.refetch();
      }
    });
  }

  public onDeleteProjection(projectionId: number): void {
    this.projectionService.deleteProjection(projectionId);
  }
}
