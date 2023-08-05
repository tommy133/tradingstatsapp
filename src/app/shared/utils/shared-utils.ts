import { ActivatedRoute, Router } from '@angular/router';

export function redirectById(
  router: Router,
  activatedRoute: ActivatedRoute,
  id: number,
  routeToNavigate: string,
) {
  router.navigate([`${routeToNavigate}${id}`], {
    relativeTo: activatedRoute,
    queryParams: activatedRoute.snapshot.queryParams,
    queryParamsHandling: 'preserve',
  });
}

export function formatDate(inputDate: string): string {
  return inputDate.split('T')[0];
}
