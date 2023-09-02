import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
})
export class DatePickerComponent {
  date: Date = new Date();
  @Input() bgColor: string = 'bg-light-gray';
  @Output() onchangeEvent: EventEmitter<Date> = new EventEmitter<Date>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const initialDate = this.activatedRoute.snapshot.queryParams['date'];
    if (initialDate) this.date = new Date(initialDate);
    else {
      this.navigateOnDateChange(); //navigate with initial date (today)
    }
  }
  get value(): string {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(this.date, 'yyyy-MM');
    return formattedDate || '';
  }

  nextMonth() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.navigateOnDateChange();
  }

  previousMonth() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.navigateOnDateChange();
  }

  updateDate(newDate: Date | null) {
    this.date = newDate ?? new Date();
    this.navigateOnDateChange();
  }

  private emitDateChange() {
    this.onchangeEvent.emit(this.date);
  }

  private navigateOnDateChange() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { date: this.value },
      queryParamsHandling: 'merge',
    });
  }
}
