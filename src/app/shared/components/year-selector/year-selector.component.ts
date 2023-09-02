import { Component } from '@angular/core';

@Component({
  selector: 'app-year-selector',
  templateUrl: './year-selector.component.html',
})
export class YearSelectorComponent {
  year = 2023;
  minYear = 2000;
  maxYear = 2100;

  previousYear = () => {
    if (this.year > this.minYear) {
      this.year--;
    }
  };

  nextYear = () => {
    if (this.year < this.maxYear) {
      this.year++;
    }
  };

  get isPrevDisabled() {
    return this.year <= this.minYear;
  }

  get isNextDisabled() {
    return this.year >= this.maxYear;
  }
}
