import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `<div class="h-full bg-dark-gray flex-grow overflow-auto">
    <ng-content></ng-content>
  </div> `,
})
export class SidebarComponent {}
