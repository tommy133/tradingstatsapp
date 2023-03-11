import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
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

  ngOnInit(): void {
    this.getProjections();
  }

  public getProjections(): void {
    this.projections$ = this.projectionService.getProjections();
  }

  public onAddProjection(projection: Projection): void {
    this.projectionService.addProjection(projection);
  }

  public onUpdateProjection(projection: Projection): void {
    this.projectionService.updateProjection(projection).subscribe(() => {
      //remove subscribe
      this.getProjections();
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }

  public onDeleteProjection(projectionId: number): void {
    this.projectionService.deleteProjection(projectionId).subscribe(
      () => {
        this.getProjections();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}
