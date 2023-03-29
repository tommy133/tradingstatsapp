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
  projections$: Observable<Projection[]> =
    this.projectionService.getProjections();

  constructor(private projectionService: ProjectionService) {
    this.onDeleteProjection(33);
  }

  onAddProjection(projection: Projection): void {
    this.projectionService.addProjection(projection);
  }

  onUpdateProjection(projection: Projection): void {
    this.projectionService.updateProjection(projection);
  }

  onDeleteProjection(projectionId: number): void {
    this.projectionService.deleteProjection(projectionId);
  }

  filterProjections(key: string): void {
    const fieldContainsKey = (field: string) =>
      field.toLowerCase().includes(key.toLowerCase());

    const filterFn = ({
      symbol = '',
      name_tf = '',
      name_st = '',
    }: Projection) => {
      fieldContainsKey(symbol) ||
        fieldContainsKey(name_tf) ||
        fieldContainsKey(name_st);
    };
  }
}
