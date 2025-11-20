import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLiminationComponent } from './add-limination.component';

describe('AddLiminationComponent', () => {
  let component: AddLiminationComponent;
  let fixture: ComponentFixture<AddLiminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLiminationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLiminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
