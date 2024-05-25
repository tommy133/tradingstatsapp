import { Component, Input } from '@angular/core';
import { ProjectionComment } from 'src/app/data/models/pcomment';

@Component({
  selector: 'comments-thread',
  templateUrl: './comments-thread.component.html',
})
export class CommentsThreadComponent {
  @Input() comments: ProjectionComment[] = [];
}
