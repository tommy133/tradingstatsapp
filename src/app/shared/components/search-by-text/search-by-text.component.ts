import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-by-text',
  template: `
    <div
      class="pl-4 flex justify-between space-x-2 h-10 items-center bg-white mt-2 rounded"
    >
      <app-icon-button
        iconSource="assets/svg/search.svg"
        [iconSvgStyle]="{ 'width.px': 24, 'height.px': 24, 'opacity': 0.4 }"
      ></app-icon-button>
      <input
        class="small appearance-none bg-transparent w-full border-none focus:outline-none"
        type="text"
        [formControl]="searchControl"
        [placeholder]="placeholder"
        autocomplete="off"
      />
    </div>
  `,
})
export class SearchByTextComponent {
  @Input() searchControl = new FormControl<string>('');
  @Input() placeholder: string = '';
}
