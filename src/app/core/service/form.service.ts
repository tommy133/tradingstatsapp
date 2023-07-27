import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  public applyDebounceOnSearch(
    observable: Observable<string | null>,
  ): Observable<string> {
    return observable.pipe(
      map((it) => it ?? ''),
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
    );
  }

  public filterItems<T>(
    source$: Observable<T[]>,
    search$: Observable<string>,
    keySelector: (item: T) => string,
  ): Observable<T[]> {
    return combineLatest([source$, search$]).pipe(
      map(([source, search]) => {
        const normalizedSearch = search.toLocaleLowerCase();
        if (normalizedSearch === '') return source;
        return source.filter((item) => {
          const normalizedFullName = keySelector(item).toLocaleLowerCase();
          return normalizedFullName.includes(normalizedSearch);
        });
      }),
    );
  }

  public checkErrorsByControl(formControl: AbstractControl<any> | null) {
    return formControl?.invalid && (formControl.dirty || formControl.touched);
  }
}
