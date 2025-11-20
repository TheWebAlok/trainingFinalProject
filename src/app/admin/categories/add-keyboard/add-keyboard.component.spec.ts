import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKeyboardComponent } from './add-keyboard.component';

describe('AddKeyboardComponent', () => {
  let component: AddKeyboardComponent;
  let fixture: ComponentFixture<AddKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddKeyboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
