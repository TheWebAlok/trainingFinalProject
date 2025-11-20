import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingCardComponent } from './wedding-card.component';

describe('WeddingCardComponent', () => {
  let component: WeddingCardComponent;
  let fixture: ComponentFixture<WeddingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
