import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionListComponent } from './projection-list.component';

describe('ProjectionComponent', () => {
  let component: ProjectionListComponent;
  let fixture: ComponentFixture<ProjectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
