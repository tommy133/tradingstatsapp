import { trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarAnimationState } from '../../utils/custom-types';
import { sidebarAnimationFadeInOut } from '../../utils/sidebar-fade-in-out';
import { sidebarRightAnimationSlide } from '../../utils/sidebar-right-animation';

@Component({
  selector: 'app-sidebar',
  template: ` <div
      [@sidebarRightInOut]="sidebarState"
      class="fixed flex
    flex-col h-full top-0 bottom-0 right-0 md:w-[460px]"
    >
      <div class="h-full bg-dark-gray flex-grow overflow-auto">
        <ng-content></ng-content>
      </div>
    </div>
    <div
      [@fadeInOut]="sidebarState"
      class="fixed top-0 left-0 right-0 bottom-0 bg-dark/40"
      (click)="close()"
    ></div>`,
  animations: [
    trigger('sidebarRightInOut', sidebarRightAnimationSlide),
    trigger('fadeInOut', sidebarAnimationFadeInOut),
  ],
})
export class SidebarComponent {
  @Input() sidebarState: SidebarAnimationState = 'in';
  @Output() closeEvent = new EventEmitter<SidebarAnimationState>();

  close() {
    this.closeEvent.emit(this.sidebarState);
  }
}
