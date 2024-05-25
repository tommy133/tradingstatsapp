import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
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
        class="absolute w-full mt-1 no-scrollbar max-h-[50vh] overflow-y-auto
      bg-white rounded"
      >
        <ng-container *ngFor="let symbol of filteredSymbolsByName$ | async">
          <div
            class="border-b cursor-pointer hover:bg-gray-300 p-4"
            (click)="selectSymbol(symbol)"
          >
            {{ symbol.name_sym }}
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class SymbolSearchComponent {
  private formService = inject(FormService);
  private symbolService = inject(SymbolService);

  @Input() placeholder: string = 'Search symbol';
  @Input() selected = '';
  @Output() symbolSelected = new EventEmitter<any>();

  symbols$: Observable<Symbol[]> = this.symbolService.assets$;

  showSymbolSuggestions = false;
  searchSymbolsControl = new FormControl<string>('');
  searchSymbols$ = this.formService.applyDebounceOnSearch(
    this.searchSymbolsControl.valueChanges,
  );
  isSearchActive$ = this.searchSymbolsControl.valueChanges.pipe(
    map((search) => (search?.length ?? 0) > 0),
  );
  filteredSymbolsByName$ = this.formService.filterItems(
    this.symbols$,
    this.searchSymbols$,
    ({ name_sym }) => name_sym,
  );

  onShowSuggestions(show: boolean) {
    this.showSymbolSuggestions = show;
  }

  selectSymbol(symbol: Symbol) {
    this.symbolSelected.emit(symbol);
    this.showSymbolSuggestions = false;
    this.selected = symbol.name_sym;
  }
}
