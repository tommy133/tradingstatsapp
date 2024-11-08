import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Comment } from '../comments-thread.component';

@Component({
  selector: 'app-comment-entry',
  template: ` <div class="flex items-center gap-2">
      <label class="text-dark-400 cursor-pointer">
        {{ comment.inserted_at | date : 'd MMMM y  h:mm a' }}
      </label>
      <button type="button" (click)="isOpen = !isOpen">
        <!-- Toggle reply output to a commentview parent component -->
        <svg-icon
          [svgStyle]="{ 'height.px': 32, 'width.px': 32 }"
          src="assets/svg/reply.svg"
        ></svg-icon>
      </button>
    </div>

    <div class="flex space-x-2 mt-1">
      <div class="flex rounded-b-lg rounded-tr-lg p-4 bg-blue-400">
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
