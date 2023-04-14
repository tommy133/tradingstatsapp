import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Projection } from '../model/projection';
import { ProjectionService } from '../service/projection.service';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
  styleUrls: ['./projection-list.component.css'],
})
export class ProjectionListComponent {
  public projections$?: Observable<Projection[]>;

  constructor(private projectionService: ProjectionService) {}

  ngOnInit() {
    this.projections$ = this.getProjections();
  }

  public getProjections(): Observable<Projection[]> {
    return this.projectionService.getProjections();
  }

  public onAddProjection(projection: Projection): void {
    this.projectionService.addProjection(projection);
  }

  public onUpdateProjection(projection: Projection): void {
    this.projectionService.updateProjection(projection).subscribe(() => {
      //remove subscribe
      this.projections$ = this.getProjections();
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }

  public onDeleteProjection(projectionId: number): void {
    this.projectionService.deleteProjection(projectionId).subscribe(
      () => {
        this.projections$ = this.getProjections();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public filterProjections(key: string): void {
    const filterFn = (projection: Projection) =>
      projection.name_sym?.toLowerCase().includes(key.toLowerCase()) ||
      projection.name_tf?.toLowerCase().includes(key.toLowerCase()) ||
      projection.name_st?.toLowerCase().includes(key.toLowerCase());

    this.projections$
      ?.pipe(map((projections) => projections.filter(filterFn)))
      .subscribe((filteredProjections) => {
        this.projections$ = key
          ? of(filteredProjections)
          : this.getProjections();
      });
  }
}
