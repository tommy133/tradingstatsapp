import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { Market } from 'src/app/data/models/market';
import { MarketService } from 'src/app/data/service/market.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { Symbol } from 'src/app/modules/assets/model/symbol';
import { MutationType } from 'src/app/shared/utils/custom-types';
import { navigatePreservingQueryParams } from 'src/app/shared/utils/shared-utils';
import { SymbolCreateInput } from '../../../model/symbolCreateInput';
import { SymbolUpdateInput } from '../../../model/symbolUpdateInput';

@Component({
  selector: 'app-asset-mutation',
  templateUrl: './asset-mutation.component.html',
  styles: [
    `
      .row {
        @apply flex items-center justify-between;
      }
    `,
  ],
})
export class AssetMutationComponent {
  private formBuilder = inject(FormBuilder);
  private assetService = inject(SymbolService);
  private marketService = inject(MarketService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  markets$: Observable<Market[]> = this.marketService.getMarkets();

  paramId = this.activatedRoute.snapshot.params['id'];
  isLoading: boolean = false;
  errors: Array<string> = [];

  //CONTROLS
  id = this.formBuilder.control<number | null>(null);
  name = this.formBuilder.control<string | null>(null);
  market = this.formBuilder.control<number | null>(null, Validators.required);
  description = this.formBuilder.control<string | null>(null);

  assetForm = this.formBuilder.group({
    id: this.id,
    name: this.name,
    market: this.market,
    description: this.description,
  });

  async ngOnInit() {
    try {
      if (this.paramId) {
        const assetDetails = await firstValueFrom(
          this.assetService.getSymbol(this.paramId),
        );
        if (assetDetails) this.setInitialFormState(assetDetails);
      }
    } catch (err) {
      console.error(err);
    }
  }

  private setInitialFormState(assetDetails: Symbol) {
    const {
      id_sym,
      name_sym,
      market: { id_mkt },
      description,
    } = assetDetails;
    this.id.setValue(id_sym);
    this.name.setValue(name_sym);
    this.market.setValue(id_mkt);
    this.description.setValue(description ?? null);
  }

  get mutation(): MutationType {
    if (this.paramId) {
      return MutationType.EDIT;
    }
    return MutationType.ADD;
  }

  get isMutationAdd(): boolean {
    return this.mutation === MutationType.ADD;
  }

  get formType(): string {
    return this.isMutationAdd ? 'ADD' : 'EDIT';
  }

  get buttonType(): string {
    return this.isMutationAdd ? 'Add' : 'Save';
  }

  get buttonColor(): string {
    return this.isMutationAdd ? 'bg-green' : 'bg-orange';
  }

  goToList() {
    let route: string;
    if (this.activatedRoute.snapshot.routeConfig?.path?.includes('edit'))
      route = '../..';
    else route = '..';

    navigatePreservingQueryParams([route], this.router, this.activatedRoute);
  }

  goToDetails() {
    navigatePreservingQueryParams(['..'], this.router, this.activatedRoute);
  }

  onAddAsset(symbolCreateInput: SymbolCreateInput) {
    return this.assetService.addSymbol(symbolCreateInput);
  }

  onUpdateAsset(symbolUpdateInput: SymbolUpdateInput) {
    return this.assetService.updateSymbol(symbolUpdateInput);
  }

  private async handleMutationAsset(
    operationInput: SymbolCreateInput | SymbolUpdateInput,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      const result = this.isMutationAdd
        ? await firstValueFrom(
            this.onAddAsset(operationInput as SymbolCreateInput),
          )
        : await firstValueFrom(
            this.onUpdateAsset(operationInput as SymbolUpdateInput),
          );
      if (result) {
        this.isLoading = false;
        return result;
      }
    } catch (e: any) {
      this.errors = [...this.errors, e.message as string];
    } finally {
      this.isLoading = false;
    }
  }

  private getSymbolCreateInput(): SymbolCreateInput {
    const { name, market, description } = this.assetForm.value;
    return {
      name_sym: name!,
      id_mkt: market!,
      description: description!,
    };
  }

  private getSymbolUpdateInput(): SymbolUpdateInput {
    const { id, name, market, description } = this.assetForm.value;
    return {
      id_sym: id!,
      name_sym: name!,
      id_mkt: market!,
      description: description!,
    };
  }
  async onSubmit() {
    if (this.assetForm.invalid) {
      this.toastService.error({
        message: 'Invalid form!',
      });
      return;
    }

    const symbolInput: SymbolCreateInput | SymbolUpdateInput = this
      .isMutationAdd
      ? this.getSymbolCreateInput()
      : this.getSymbolUpdateInput();

    const symbolId = await this.handleMutationAsset(symbolInput);
    if (this.errors.length === 0 && symbolId) {
      const operation = this.isMutationAdd ? 'created' : 'updated';
      this.toastService.success({
        message: `Operation ${operation} successfully`,
      });
      this.goToList();
    } else {
      this.errors.forEach((error) => {
        this.toastService.error({
          message: error,
        });
      });
    }
  }
}