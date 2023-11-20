import { trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarAnimationState } from '../../utils/custom-types';
import { sidebarAnimationFadeInOut } from '../../utils/sidebar-fade-in-out';
import { sidebarLeftAnimationSlide } from '../../utils/sidebar-left-animation';
import { sidebarRightAnimationSlide } from '../../utils/sidebar-right-animation';

export type SidebarMode = 'right' | 'left';

@Component({
  selector: 'app-sidebar',
  template: ` <div
      *ngIf="isSidebarLeft"
      [@sidebarLeftInOut]="sidebarState"
      class="fixed flex
    flex-col h-full top-0 bottom-0 left-0 md:w-[460px]"
    >
      <div class="h-full bg-dark-gray flex-grow overflow-auto ">
        <ng-content select="[left-content]"></ng-content>
      </div>
    </div>
    <div
      *ngIf="isSidebarRight"
      [@sidebarRightInOut]="sidebarState"
      class="fixed flex flex-col h-full top-0 bottom-0 right-0 md:w-[460px]"
    >
      <div class="h-full bg-dark-gray flex-grow overflow-auto ">
        <ng-content select="[right-content]"></ng-content>
      </div>
    </div>
    <div
      [@fadeInOut]="sidebarState"
      class="fixed top-0 left-0 right-0 bottom-0"
      [ngClass]="{ 'bg-dark/40': fadeDarkBackground }"
      (click)="close()"
    ></div>`,
  animations: [
    trigger('sidebarRightInOut', sidebarRightAnimationSlide),
    trigger('sidebarLeftInOut', sidebarLeftAnimationSlide),
    trigger('fadeInOut', sidebarAnimationFadeInOut),
  ],
})
export class SidebarComponent {
  @Input() mode: SidebarMode = 'right';
  @Input() sidebarState: SidebarAnimationState = 'in';
  @Input() fadeDarkBackground = true;
  @Output() closeEvent = new EventEmitter<SidebarAnimationState>();

  get isSidebarRight(): boolean {
    return this.mode === 'right';
  }

  get isSidebarLeft(): boolean {
    return this.mode === 'left';
  }

  close() {
    this.closeEvent.emit(this.sidebarState);
  }
}
