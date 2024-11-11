import { Component, inject, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CreateOperationCommentInput } from 'src/app/data/models/opcomment';
import { CreateProjectionCommentInput } from 'src/app/data/models/pcomment';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { Comment } from '../comments-thread.component';

@Component({
  selector: 'app-comment-entry',
  template: `
    <div class="flex items-center gap-2">
      <label class="text-dark-400 cursor-pointer">
        {{ comment.inserted_at | date : 'd MMMM y  h:mm a' }}
      </label>
      <button type="button" *ngIf="repliable" (click)="toggleReply()">
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
    </div>
    <app-comment-reply
      [isReplyOpen]="replyToggle()"
      (onComment)="sendChildComment(comment, $event)"
    />
  `,
})
export class CommentEntryComponent {
  private router = inject(Router);
  private projectionCommentService = inject(ProjectionCommentService);
  private operationCommentService = inject(OperationCommentService);

  @Input() comment!: Comment;
  @Input() repliable = true;

  replyToggle = signal(false);

  toggleReply() {
    this.replyToggle.update((toggle) => !toggle);
  }

  sendChildComment(comment: Comment, text: string) {
    if ('id_pc' in comment) {
      const projectionCreateInput = {
        comment: text,
        id_proj: comment.id_proj,
        parent_id: comment.id_pc,
      };
      this.handleMutationProjectionComment(projectionCreateInput);
    } else if ('id_opc' in comment) {
      const operationCreateInput = {
        comment: text,
        id_op: comment.id_op,
        parent_id: comment.id_opc,
      };
      this.handleMutationOperationComment(operationCreateInput);
    } else {
      console.error('Unknown comment type');
      return;
    }
  }

  isLoading = false;
  errors: Array<string> = [];
  private async addProjectionComment(comment: CreateProjectionCommentInput) {
    return await firstValueFrom(
      this.projectionCommentService.addComment(comment),
    );
  }

  private async addOperationComment(comment: CreateOperationCommentInput) {
    return await firstValueFrom(
      this.operationCommentService.addComment(comment),
    );
  }

  private async handleMutationProjectionComment(
    commentInput: CreateProjectionCommentInput,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      const result = this.addProjectionComment(commentInput);
      if (result) {
        this.isLoading = false;
        return result;
      }
    } catch (e: any) {
      this.errors = [...this.errors, e.message as string];
    } finally {
      this.isLoading = false;
    }
  }

  private async handleMutationOperationComment(
    commentInput: CreateOperationCommentInput,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      const result = this.addOperationComment(commentInput);
      if (result) {
        this.isLoading = false;
        return result;
      }
    } catch (e: any) {
      this.errors = [...this.errors, e.message as string];
    } finally {
      this.isLoading = false;
    }
  }

  processLinks(e: any) {
    const element: HTMLElement = e.target;
    if (element.nodeName === 'A') {
      e.preventDefault();
      const link = element.getAttribute('href');
      this.router.navigate([link], { queryParamsHandling: 'preserve' });
    }
  }
}
