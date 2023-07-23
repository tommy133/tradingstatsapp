import { ActivatedRoute, Router } from '@angular/router';

export function redirectById(
  router: Router,
  activatedRoute: ActivatedRoute,
  id: number,
  routeToNavigate: string,
) {
  router.navigate([`${routeToNavigate}${id}`], {
    relativeTo: activatedRoute,
  });
}

export function formatDate(inputDate: Date): string {
  const stringDate = inputDate.toString();
  return stringDate.split('T')[0];
}
