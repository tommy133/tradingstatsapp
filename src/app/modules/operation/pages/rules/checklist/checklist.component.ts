import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styles: [],
})
export class ChecklistComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  context = this.formBuilder.control<boolean | null>(null);
  prize_from_vpoc = this.formBuilder.control<boolean | null>(null);
  prize_from_vwap = this.formBuilder.control<boolean | null>(null);
  shakeout = this.formBuilder.control<boolean | null>(null);
  volume = this.formBuilder.control<boolean | null>(null);
  delta = this.formBuilder.control<boolean | null>(null);

  // Initialize the form with a FormArray
  checklistForm = this.formBuilder.group({
    context: this.context,
    prize_from_vpoc: this.prize_from_vpoc,
    prize_from_vwap: this.prize_from_vwap,
    shakeout: this.shakeout,
    volume: this.volume,
    delta: this.delta,
  });

  fields = [
    { name: 'context', label: 'Context' },
    { name: 'prize_from_vpoc', label: 'Prize from VPOC' },
    { name: 'prize_from_vwap', label: 'Prize from VWAP' },
    { name: 'shakeout', label: 'Shakeout' },
    { name: 'volume', label: 'Volume' },
    { name: 'delta', label: 'Delta' },
  ];

  // Handle form submission
  goToddOperation() {
    this.router.navigate(['add'], {
      relativeTo: this.activatedRoute,
      state: { data: this.checklistForm.value },
    });
  }
}
