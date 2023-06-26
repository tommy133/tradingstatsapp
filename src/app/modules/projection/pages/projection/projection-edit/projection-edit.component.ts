import { Component, OnInit } from '@angular/core';
import { Projection } from '../../../model/projection';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-edit',
  templateUrl: './projection-edit.component.html',
})
export class ProjectionEditComponent implements OnInit {
  constructor(private projectionService: ProjectionService) {}

  ngOnInit(): void {}

  public onUpdateProjection(projection: Projection): void {
    this.projectionService.updateProjection(projection);
  }
}
