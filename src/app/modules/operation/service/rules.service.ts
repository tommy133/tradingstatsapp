import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class RulesService {
  private apiServerUrl = `${environment.apiBaseUrl}/rules`;

  constructor(private httpClient: HttpClient) {}

  getRules() {
    return firstValueFrom(
      this.httpClient.get(this.apiServerUrl, { responseType: 'text' }),
    );
  }

  updateRules(newRules: string) {
    return firstValueFrom(
      this.httpClient.put(this.apiServerUrl, { rules: newRules }),
    );
  }
}
