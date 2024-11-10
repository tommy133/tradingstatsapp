import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import {
  getPotentialDirection,
  isAccumulation,
  isDistribution,
  isEquilibrium,
} from './formulas';

@Component({
  selector: 'app-checklist-form',
  templateUrl: './checklist-form.component.html',
  styles: [],
})
export class ChecklistFormComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  isAccumulation = isAccumulation;
  isDistribution = isDistribution;
  isEquilibrium = isEquilibrium;

  context = this.formBuilder.control<boolean | null>(null);
  prize_from_vpoc = this.formBuilder.control<boolean | null>(null);
  prize_from_vwap = this.formBuilder.control<boolean | null>(null);
  shakeout = this.formBuilder.control<boolean | null>(null);
  jac = this.formBuilder.control<boolean | null>(null);
  volume = this.formBuilder.control<boolean | null>(null);
  delta = this.formBuilder.control<boolean | null>(null);

  // Initialize the form with a FormArray
  checklistForm = this.formBuilder.group({
    context: this.context,
    prize_from_vpoc: this.prize_from_vpoc,
    prize_from_vwap: this.prize_from_vwap,
    shakeout: this.shakeout,
    jac: this.jac,
    volume: this.volume,
    delta: this.delta,
  });

  accumulationOrDistribution$ = this.checklistForm.valueChanges.pipe(
    map((checklist) => getPotentialDirection(checklist)),
  );

  fields = [
    { name: 'context', label: 'Context' },
    { name: 'prize_from_vpoc', label: 'Prize from VPOC' },
    { name: 'prize_from_vwap', label: 'Prize from VWAP' },
    { name: 'shakeout', label: 'Shakeout' },
    { name: 'jac', label: 'JAC' },
    { name: 'volume', label: 'Volume' },
    { name: 'delta', label: 'Delta' },
  ];

  // Handle form submission
  goToddOperation(checklistForm: any) {
    const newChecklistForm = { ...checklistForm.value };
    this.checklistForm.reset();
    this.router.navigate(['../add'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve',
      state: { data: newChecklistForm },
    });
  }
}
