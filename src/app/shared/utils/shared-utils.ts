import { ActivatedRoute, Router } from '@angular/router';

export function formatDate(inputDate: string): string {
  return inputDate.split('T')[0];
}

export function navigatePreservingQueryParams(
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
