import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Comment } from '../comments-thread.component';

@Component({
  selector: 'comment-entry',
  template: `<button type="button" (click)="isOpen = !isOpen">
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
        <p
          [innerHTML]="comment.comment"
          class="text-white"
          (click)="processLinks($event)"
        ></p>
      </div>
    </div>`,
})
export class CommentEntryComponent {
  private router = inject(Router);
  @Input() comment!: Comment;
  @Input() isOpen = false;

  processLinks(e: any) {
    const element: HTMLElement = e.target;
    if (element.nodeName === 'A') {
      e.preventDefault();
      const link = element.getAttribute('href');
      this.router.navigate([link], { queryParamsHandling: 'preserve' });
    }
  }
}
