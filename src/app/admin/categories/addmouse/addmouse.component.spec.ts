import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmouseComponent } from './addmouse.component';

describe('AddmouseComponent', () => {
  let component: AddmouseComponent;
  let fixture: ComponentFixture<AddmouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmouseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
