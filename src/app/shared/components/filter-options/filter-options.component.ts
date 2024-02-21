import { Component, HostListener, inject } from '@angular/core';
import { ClickAwayService } from 'src/app/core/service/click-away.service';

@Component({
  selector: 'app-filter-options',
  template: `<app-icon-button
      [iconSource]="buttonIcon"
      (click)="toggleButton()"
    />
    <div
      *ngIf="buttonToggle"
      class="absolute top-0 left-10 rounded-md bg-white shadow-dropshadow z-50"
    >
      <div class="flex flex-col w-[20rem] h-full p-6 space-y-8">
        <div class="flex justify-between items-center">
          <h1 class="font-semibold">Filter by</h1>
          <ng-content select="[resetButton]" />
        </div>
        <ng-content select="[filters]" />
      </div>
    </div> `,
  styles: [
    `
      :host {
        @apply relative;
      }
    `,
  ],
})
export class FilterOptionsComponent {
  private clickAwayService = inject(ClickAwayService);

  buttonToggle = false;

  toggleButton() {
    this.buttonToggle = !this.buttonToggle;
  }

  get buttonIcon() {
    if (this.buttonToggle) {
      return 'assets/svg/close.svg';
    }
    return 'assets/svg/filter.svg';
  }

  @HostListener('click')
  clickInside() {
    this.clickAwayService.clickInside('filters');
  }

  @HostListener('document:click')
  clickout() {
    if (this.buttonToggle) {
      if (this.clickAwayService.clickOut('filters')) {
        this.buttonToggle = false;
      }
    }
  }
}
