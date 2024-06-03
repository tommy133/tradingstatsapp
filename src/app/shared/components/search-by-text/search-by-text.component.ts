import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-by-text',
  template: `
    <div
      class="pl-4 flex justify-between space-x-2 min-w-[200px] h-10 items-center bg-white mt-2 rounded"
    >
      <ng-container
        [ngTemplateOutlet]="isSearchActive ? clearSearch : search"
      ></ng-container>
      <input
        #searchInput
        class="small appearance-none bg-transparent w-full border-none focus:outline-none"
        type="text"
        [formControl]="searchControl"
        [placeholder]="placeholder"
        autocomplete="off"
        (focus)="onFocus()"
        (focusout)="onFocusOut()"
      />
    </div>
    <ng-template #search>
      <icon-button
        iconSource="assets/svg/search.svg"
        [iconSvgStyle]="{ 'width.px': 24, 'height.px': 24, 'opacity': 0.4 }"
      />
    </ng-template>
    <ng-template #clearSearch>
      <button (click)="focusAndResetInput()">
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

  @Input() set value(value: string) {
    this.searchControl.setValue(value);
  }

  @Output() showSuggestions = new EventEmitter<boolean>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  focusAndResetInput() {
    this.searchControl.reset();
    this.searchInput.nativeElement.focus();
  }

  onFocus() {
    this.showSuggestions.emit(true);
  }

  onFocusOut() {
    setTimeout(() => {
      this.showSuggestions.emit(false);
    }, 200);
  }
}
