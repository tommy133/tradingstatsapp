import { Component, Input } from '@angular/core';
import { Comment } from '../comments-thread.component';

@Component({
  selector: 'app-comment-children',
  template: `<div class="absolute left-[45px] bottom-[-5px]">
      <button type="button" *ngIf="checkChildren" (click)="onToggleChildren()">
        <svg-icon
          [svgStyle]="{ 'height.p-x': 32, 'width.px': 32 }"
          src="assets/svg/comment_thread.svg"
        ></svg-icon>
      </button>
    </div>
    <ng-container *ngIf="toggleChildren && checkChildren">
      <div *ngFor="let child of children" class="flex mt-2">
        <app-comment-entry
          [comment]="child"
          [repliable]="false"
        ></app-comment-entry>
      </div>
    </ng-container> `,
})
export class CommentChildrenComponent {
  @Input() children!: Comment[];
  toggleChildren = false;

  get checkChildren() {
    return this.children.length > 0;
  }

  onToggleChildren() {
    this.toggleChildren = !this.toggleChildren;
  }
}
