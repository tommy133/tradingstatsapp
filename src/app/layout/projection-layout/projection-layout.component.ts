import { Component } from '@angular/core';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-projection-layout',
  templateUrl: './projection-layout.component.html',
  styles: [],
})
export class ProjectionLayoutComponent {
  title = MainLayoutComponent.title;
  buttons = MainLayoutComponent.buttons;

  constructor(pcommentService: ProjectionCommentService) {
    pcommentService.getComments().subscribe(); //caching purposes
  }
}
