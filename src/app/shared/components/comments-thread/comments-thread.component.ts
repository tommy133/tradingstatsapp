import { Component, Input } from '@angular/core';
import { OperationComment } from 'src/app/data/models/opcomment';
import { ProjectionComment } from 'src/app/data/models/pcomment';

export type Comment = ProjectionComment | OperationComment;

@Component({
  selector: 'comments-thread',
  templateUrl: './comments-thread.component.html',
})
export class CommentsThreadComponent {
  @Input() comments: Comment[] = [];
}
