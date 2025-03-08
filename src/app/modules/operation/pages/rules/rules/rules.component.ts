import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { RulesService } from '../../../service/rules.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
})
export class RulesComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private rulesService = inject(RulesService);
  private toastService = inject(ToastService);

  rulesForm: FormGroup;
  isLoading: boolean = false;

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
      this.isLoading = true;
      const rules = await this.rulesService.getRules();
      if (rules) {
        this.isLoading = false;
        this.rulesForm.patchValue({ rules });
      }
    } catch (error) {
      this.toastService.error({ message: 'Error loading rules: ' + error });
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.rulesForm.valid) {
      const updatedRules = this.rulesForm.value.rules;
      try {
        await this.rulesService.updateRules(updatedRules);
        this.toastService.success({ message: 'Rules updated' });
      } catch (error) {
        this.toastService.error({ message: 'Error updating rules: ' + error });
      }
    }
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['.'], this.router, this.activatedRoute);
  }
}
