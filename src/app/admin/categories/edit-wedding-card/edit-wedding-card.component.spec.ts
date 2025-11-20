import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWeddingCardComponent } from './edit-wedding-card.component';

describe('EditWeddingCardComponent', () => {
  let component: EditWeddingCardComponent;
  let fixture: ComponentFixture<EditWeddingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWeddingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWeddingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
