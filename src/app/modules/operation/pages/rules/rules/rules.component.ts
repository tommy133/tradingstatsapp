import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { RulesService } from '../../../service/rules.service';

@Component({
  selector: 'app-rules',
  template: `
    <app-back-to
      class="top-5"
      backText="BACK TO OPERATIONS"
      backTo=".."
    ></app-back-to>

    <form [formGroup]="rulesForm" (ngSubmit)="onSubmit()">
      <div class="flex flex-col h-full  whitespace-pre gap-3 p-5 relative">
        <button
          class="absolute right-5 top-[-45px] w-[250px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          type="submit"
        >
          Save Changes
        </button>
        <textarea
          class="font-semibold rounded-md no-scrollbar p-4 bg-dark text-white"
          rows="20"
          cols="100"
          formControlName="rules"
        ></textarea>
      </div>
    </form>

    <app-sidebar
      [sidebarState]="sidebarRight.isActivated ? 'in' : 'out'"
      (closeEvent)="onCloseSidebar()"
    >
      <ng-container right-content>
        <router-outlet #sidebarRight="outlet"></router-outlet>
      </ng-container>
    </app-sidebar>
  `,
})
export class RulesComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private rulesService = inject(RulesService);
  private toastService = inject(ToastService);

  rulesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.rulesForm = this.fb.group({
      rules: [''],
    });
  }

  ngOnInit(): void {
    this.loadRules();
  }

  private async loadRules() {
    try {
      const rules = await this.rulesService.getRules();
      this.rulesForm.patchValue({ rules });
    } catch (error) {
      console.error('Error loading rules', error);
    }
  }

  async onSubmit() {
    if (this.rulesForm.valid) {
      const updatedRules = this.rulesForm.value.rules;
      try {
        const res = await this.rulesService.updateRules(updatedRules);
        if (res) this.toastService.success({ message: 'Rules updated' });
      } catch (error) {
        this.toastService.error({ message: 'Error updating rules: ' + error });
      }
    }
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }
}
