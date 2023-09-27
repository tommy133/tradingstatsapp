import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { Projection } from 'src/app/modules/projection/model/projection';

export interface TableColumn {
  name: string;
}

@Component({
  selector: 'app-table-projection',
  templateUrl: './table-projection.component.html',
})
export class TableProjectionComponent {
  @Input() rows!: Projection[];
  @Output() deleteEvent = new EventEmitter<number>();

  router = inject(Router);
  toastService = inject(ToastService);
  @Input() trimNumber?: number;

  columns: TableColumn[] = [
    { name: 'Symbol' },
    { name: 'Direction' },
    { name: 'Date' },
    { name: 'Timeframe' },
    { name: 'Status' },
    { name: 'Actions' },
  ];

  ngOnChanges(changes: SimpleChanges) {
    switch (changes['trimNumber']?.currentValue) {
      case 1:
        this.rows = [];
        this.toastService.info({ message: 'No records for this period' });
        break;
      case 2:
        this.rows.pop();
        this.rows.pop();
        break;
      case 3:
        this.rows.pop();

        break;
    }
  }

  gotoEditProjection(projId: number, event: any) {
    event.stopPropagation();
    this.router.navigate([`/projections/edit/${projId}`]);
  }

  deleteProjection(projId: number, event: any) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this projection?')) {
      this.deleteEvent.emit(projId);
    }
  }
}
