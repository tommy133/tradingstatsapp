import { Component } from '@angular/core';
import { Projection } from '../../../model/projection';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-add',
  templateUrl: './projection-add.component.html',
})
export class ProjectionAddComponent {
  constructor(private projectionService: ProjectionService) {}

  public onAddProjection(projection: Projection): void {
    this.projectionService.addProjection(projection);
  }
}
