import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { map, Observable, of, Subscription } from 'rxjs';
import {
  sidebarRightAnimationSlide,
  SidebarRightAnimationState,
} from 'src/app/shared/utils/sidebar-right-animation';
import { Projection } from '../../../model/projection';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
  styleUrls: ['./projection-list.component.css'],
  animations: [trigger('sidebarRightInOut', sidebarRightAnimationSlide)],
})
export class ProjectionListComponent {
  projections$ = this.projectionService.projections$;
  private filterSubscription?: Subscription;

  sidebarRightAnimationState: SidebarRightAnimationState = 'out';

  constructor(private projectionService: ProjectionService) {}

  public getProjections(): Observable<Projection[]> {
    return this.projectionService.getProjections();
  }

  public onDeleteProjection(projectionId: number): void {
    this.projectionService.deleteProjection(projectionId);
  }
  //TODO real time filter
  public onFilterProjections(key: string): void {
    const fieldContainsKey = (field: string) =>
      field.toLowerCase().includes(key.toLowerCase());
    const filterFn = (projection: Projection) => {
      const {
        symbol: { nameSymbol },
        status: { nameStatus },
      } = projection;

      return (
        fieldContainsKey(nameSymbol) ||
        fieldContainsKey(nameStatus) ||
        fieldContainsKey(projection.timeframe)
      );
    };

    this.filterSubscription = this.projections$
      ?.pipe(map((projections) => projections.filter(filterFn)))
      .subscribe((filteredProjections) => {
        this.projections$ = key
          ? of(filteredProjections)
          : this.getProjections();
      });
  }

  ngOnDestroy() {
    this.filterSubscription?.unsubscribe();
  }
}
