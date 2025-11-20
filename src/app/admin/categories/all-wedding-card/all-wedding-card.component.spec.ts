import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWeddingCardComponent } from './all-wedding-card.component';

describe('AllWeddingCardComponent', () => {
  let component: AllWeddingCardComponent;
  let fixture: ComponentFixture<AllWeddingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllWeddingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllWeddingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
