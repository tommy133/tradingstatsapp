import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.css'],
})
export class CommentReplyComponent {
  commentControl = new FormControl('', [Validators.required]);
  formGroup = new FormGroup({ comment: this.commentControl });

  @Input() isReplyOpen = false;
  @Output() onComment = new EventEmitter<string>();

  replyComment() {
    if (this.commentControl.valid) {
      this.onComment.emit(this.commentControl.value!);
      this.commentControl.setValue('');
    }
  }
}
