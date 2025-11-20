import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWeddingCardComponent } from './add-wedding-card.component';

describe('AddWeddingCardComponent', () => {
  let component: AddWeddingCardComponent;
  let fixture: ComponentFixture<AddWeddingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWeddingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWeddingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
