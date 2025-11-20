import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMuharComponent } from './all-muhar.component';

describe('AllMuharComponent', () => {
  let component: AllMuharComponent;
  let fixture: ComponentFixture<AllMuharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMuharComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMuharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
