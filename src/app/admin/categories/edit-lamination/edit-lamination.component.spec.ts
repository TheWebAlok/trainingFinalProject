import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLaminationComponent } from './edit-lamination.component';

describe('EditLaminationComponent', () => {
  let component: EditLaminationComponent;
  let fixture: ComponentFixture<EditLaminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLaminationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
