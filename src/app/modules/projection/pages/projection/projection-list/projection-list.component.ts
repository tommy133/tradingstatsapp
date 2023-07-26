import { trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable, of, Subscription } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
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
  public projections$?: Observable<Projection[]>;
  private deleteSubscription?: Subscription;
  private filterSubscription?: Subscription;

  sidebarRightAnimationState: SidebarRightAnimationState = 'out';

  constructor(
    private projectionService: ProjectionService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.projections$ = this.getProjections();
  }

  public getProjections(): Observable<Projection[]> {
    return this.projectionService.getProjections();
  }

  public onDeleteProjection(projectionId: number): void {
    this.deleteSubscription = this.projectionService
      .deleteProjection(projectionId)
      .subscribe(
        () => {
          this.toastService.success({
            message: 'Projection deleted successfully',
          });
          this.projections$ = this.getProjections();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        },
      );
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
    this.deleteSubscription?.unsubscribe();
    this.filterSubscription?.unsubscribe();
  }
}
