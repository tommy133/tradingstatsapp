import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, Subscription } from 'rxjs';
import { FormService } from 'src/app/core/service/form.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { Symbol } from 'src/app/modules/assets/model/symbol';

@Component({
  selector: 'app-symbol-search',
  template: `
    <div class="relative">
      <app-search-by-text
        [searchControl]="searchSymbolsControl"
        [isSearchActive]="(isSearchActive$ | async) ?? false"
        [value]="selected"
        [placeholder]="placeholder"
        (showSuggestions)="onShowSuggestions($event)"
      />
      <div
        *ngIf="showSymbolSuggestions"
        class="absolute w-full mt-1 no-scrollbar max-h-[50vh] overflow-y-auto bg-white rounded"
      >
        <ng-container *ngFor="let symbol of filteredSymbols; let i = index">
          <div
            #symbolItem
            class="border-b cursor-pointer hover:bg-gray-300 p-4"
            [class.bg-gray-300]="i === selectedIndex"
            (click)="selectSymbol(symbol)"
          >
            {{ symbol.name_sym }}
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class SymbolSearchComponent implements OnDestroy {
  private formService = inject(FormService);
  private symbolService = inject(SymbolService);

  @Input() placeholder: string = 'Search symbol';
  @Input() selected = '';
  @Output() symbolSelected = new EventEmitter<Symbol>();

  symbols$: Observable<Symbol[]> = this.symbolService.assets$;
  showSymbolSuggestions = false;
  searchSymbolsControl = new FormControl<string>('');
  searchSymbols$ = this.formService.applyDebounceOnSearch(
    this.searchSymbolsControl.valueChanges,
  );
  filteredSymbols!: Symbol[];

  isSearchActive$ = this.searchSymbolsControl.valueChanges.pipe(
    map((search) => (search?.length ?? 0) > 0),
  );
  filteredSymbolsByNameSubs?: Subscription;
  filteredSymbolsByName$ = this.formService
    .filterItems(this.symbols$, this.searchSymbols$, ({ name_sym }) => name_sym)
    .subscribe((filteredSymbols) => (this.filteredSymbols = filteredSymbols));

  @ViewChildren('symbolItem', { read: ElementRef })
  symbolItems!: QueryList<ElementRef>;
  selectedIndex = -1; // Tracks the currently highlighted item index

  onShowSuggestions(show: boolean) {
    this.showSymbolSuggestions = show;
    this.selectedIndex = -1; // Reset the selection index when suggestions are shown
  }

  selectSymbol(symbol: Symbol) {
    this.symbolSelected.emit(symbol);
    this.showSymbolSuggestions = false;
    this.selected = symbol.name_sym;
    this.selectedIndex = -1; // Reset the selection index
  }

  // Handle arrow key navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showSymbolSuggestions) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.moveSelectionDown();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.moveSelectionUp();
      } else if (event.key === 'Enter' && this.selectedIndex > -1) {
        event.preventDefault();
        const symbol = this.filteredSymbols[this.selectedIndex];
        if (symbol) {
          this.selectSymbol(symbol);
        }
      }
    }
  }

  moveSelectionDown() {
    this.selectedIndex++;
    this.scrollIntoView();
  }

  moveSelectionUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.scrollIntoView();
    }
  }

  scrollIntoView() {
    const currentItem = this.symbolItems?.get(this.selectedIndex);
    if (currentItem) {
      currentItem.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }

  ngOnDestroy() {
    if (this.filteredSymbolsByNameSubs)
      this.filteredSymbolsByName$.unsubscribe();
  }
}
