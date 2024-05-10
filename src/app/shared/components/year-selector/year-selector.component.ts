import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-year-selector',
  templateUrl: './year-selector.component.html',
})
export class YearSelectorComponent implements OnInit {
  year!: number;
  minYear = 2000;
  maxYear = 2100;

  @Input() initialYear?: number;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const initialYear = this.activatedRoute.snapshot.queryParams['year'];
    if (initialYear) this.year = initialYear;
    else if (this.initialYear) this.year = this.initialYear;
  }

  previousYear = () => {
    if (this.year > this.minYear) {
      this.year--;
      this.navigateOnDateChange();
    }
  };

  nextYear = () => {
    if (this.year < this.maxYear) {
      this.year++;
      this.navigateOnDateChange();
    }
  };

  dropQuarters() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { q1: null, q2: null, q3: null, q4: null },
      queryParamsHandling: 'merge',
    });
  }

  get isPrevDisabled() {
    return this.year <= this.minYear;
  }

  get isNextDisabled() {
    return this.year >= this.maxYear;
  }

  private navigateOnDateChange() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { year: this.year },
      queryParamsHandling: 'merge',
    });
  }
}
