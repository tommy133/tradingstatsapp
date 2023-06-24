import { trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import {
  sidebarRightAnimationSlide,
  SidebarRightAnimationState,
} from 'src/app/shared/utils/sidebar-right-animation';
import { Projection } from '../model/projection';
import { ProjectionService } from '../service/projection.service';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
  styleUrls: ['./projection-list.component.css'],
  animations: [trigger('sidebarRightInOut', sidebarRightAnimationSlide)],
})
export class ProjectionListComponent {
  public projections$?: Observable<Projection[]>;
  sidebarRightAnimationState: SidebarRightAnimationState = 'out';

  constructor(private projectionService: ProjectionService) {}

  ngOnInit() {
    this.projections$ = this.getProjections();
  }

  public getProjections(): Observable<Projection[]> {
    return this.projectionService.getProjections();
  }

  public onDeleteProjection(projectionId: number): void {
    this.projectionService.deleteProjection(projectionId).subscribe(
      () => {
        this.projections$ = this.getProjections();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }
  //TODO real time filter
  public onFilterProjections(key: string): void {
    const fieldContainsKey = (field: string) =>
      field.toLowerCase().includes(key.toLowerCase());
    const filterFn = ({
      name_sym = '',
      name_tf = '',
      name_st = '',
    }: Projection) => {
      return (
        fieldContainsKey(name_sym) ||
        fieldContainsKey(name_tf) ||
        fieldContainsKey(name_st)
      );
    };

    this.projections$
      ?.pipe(map((projections) => projections.filter(filterFn)))
      .subscribe((filteredProjections) => {
        this.projections$ = key
          ? of(filteredProjections)
          : this.getProjections();
      });
  }
}
