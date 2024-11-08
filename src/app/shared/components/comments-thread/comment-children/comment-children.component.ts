import { Component, Input } from '@angular/core';
import { Comment } from '../comments-thread.component';

@Component({
  selector: 'app-comment-children',
  template: ` <div *ngFor="let child of children" class="flex mt-2">
    <app-comment-entry [comment]="child"></app-comment-entry>
  </div>`,
})
export class CommentChildrenComponent {
  @Input() children!: Comment[];
}
