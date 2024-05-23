import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-by-text',
  template: `
    <div
      class="pl-4 flex justify-between space-x-2 h-10 items-center bg-white mt-2 rounded"
    >
      <ng-container
        [ngTemplateOutlet]="isSearchActive ? clearSearch : search"
      ></ng-container>
      <input
        class="small appearance-none bg-transparent w-full border-none focus:outline-none"
        type="text"
        [formControl]="searchControl"
        [placeholder]="placeholder"
        autocomplete="off"
      />
    </div>
    <ng-template #search>
      <icon-button
        iconSource="assets/svg/search.svg"
        [iconSvgStyle]="{ 'width.px': 24, 'height.px': 24, 'opacity': 0.4 }"
      />
    </ng-template>
    <ng-template #clearSearch>
      <button (click)="searchControl.reset()">
        <icon-button
          iconSource="assets/svg/close.svg"
          iconSvgClass="bg-dark rounded"
          [iconSvgStyle]="{ 'width.px': 24, 'height.px': 24, 'opacity': 0.4 }"
        />
      </button>
    </ng-template>
  `,
})
export class SearchByTextComponent {
  @Input() searchControl = new FormControl<string>('');
  @Input() placeholder: string = '';
  @Input() isSearchActive: boolean = false;
}
