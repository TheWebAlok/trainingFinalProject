import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMouseComponent } from './all-mouse.component';

describe('AllMouseComponent', () => {
  let component: AllMouseComponent;
  let fixture: ComponentFixture<AllMouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMouseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
