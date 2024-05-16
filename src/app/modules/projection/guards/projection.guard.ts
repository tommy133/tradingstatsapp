import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProjectionGuard implements CanActivate {
  private router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let year = next.queryParamMap.get('year');

    if (year) return true;
    if (!year) year = this.getInitialYear();

    //redirect Ok route
    this.router.navigate(['projections'], {
      queryParams: {
        year: year,
      },
    });
    return false;
  }

  getInitialYear() {
    const initialYear = new Date().getFullYear().toString();
    return initialYear;
  }
}