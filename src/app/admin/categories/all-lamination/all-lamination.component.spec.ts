import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLaminationComponent } from './all-lamination.component';

describe('AllLaminationComponent', () => {
  let component: AllLaminationComponent;
  let fixture: ComponentFixture<AllLaminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLaminationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
