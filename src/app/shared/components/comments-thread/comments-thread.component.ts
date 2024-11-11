import { Component, Input } from '@angular/core';
import { OperationComment } from 'src/app/data/models/opcomment';
import { ProjectionComment } from 'src/app/data/models/pcomment';

export type Comment = ProjectionComment | OperationComment;

@Component({
  selector: 'comments-thread',
  templateUrl: './comments-thread.component.html',
})
export class CommentsThreadComponent {
  _comments: (ProjectionComment | OperationComment)[] = [];
  rootComments: Comment[] = [];
  @Input() set comments(value: Comment[]) {
    this._comments = value;
    this.rootComments = value.filter((comment) => !comment.parent_id);
  }

  getChildrenComments(rootComment: Comment) {
    if ('id_pc' in rootComment) {
      return this._comments
        .filter((comment) => comment.parent_id === rootComment.id_pc)
        .sort((a, b) => Date.parse(a.inserted_at) - Date.parse(b.inserted_at));
    } else if ('id_opc' in rootComment) {
      return this._comments
        .filter((comment) => comment.parent_id === rootComment.id_opc)
        .sort((a, b) => Date.parse(a.inserted_at) - Date.parse(b.inserted_at));
    } else {
      console.error('Unknown comment type');
      return;
    }
  }
}
