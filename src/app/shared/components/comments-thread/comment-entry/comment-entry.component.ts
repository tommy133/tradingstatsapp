import { Component, Input } from '@angular/core';
import { ProjectionComment } from 'src/app/data/models/pcomment';

@Component({
  selector: 'comment-entry',
  template: `<button (click)="isOpen = !isOpen">
      <div class="flex items-center">
        <label class="text-dark-400 cursor-pointer">
          {{ comment.inserted_at | date : 'd MMMM y  h:mm a' }}
        </label>
        <svg-icon
          src="assets/svg/chevron.svg"
          [ngClass]="{ 'rotate-180': isOpen }"
        ></svg-icon>
      </div>
    </button>

    <div *ngIf="isOpen" class="flex space-x-2 mt-1">
      <div class="flex-grow rounded-b-lg rounded-tr-lg p-4 bg-blue-400">
        <p class="text-white">{{ comment.pcomment }}</p>
      </div>
    </div>`,
})
export class CommentEntryComponent {
  @Input() comment!: ProjectionComment;
  @Input() isOpen = false;
}
