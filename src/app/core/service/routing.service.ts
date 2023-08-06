import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  public navigatePreservingQueryParams(
    commands: any[],
    router: Router,
    activatedRoute: ActivatedRoute,
  ): void {
    router.navigate(commands, {
      relativeTo: activatedRoute,
      queryParams: activatedRoute.snapshot.queryParams,
      queryParamsHandling: 'preserve',
    });
  }
}
