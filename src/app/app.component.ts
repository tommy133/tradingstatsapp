import { Component } from '@angular/core';
import { OperationCommentService } from './data/service/opcomment.service';
import { ProjectionCommentService } from './data/service/pcomment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tradingstatsapp';

  constructor(
    pcommentService: ProjectionCommentService,
    opcommentService: OperationCommentService,
  ) {
    pcommentService.getComments().subscribe();
    opcommentService.getComments().subscribe();
  }
}
