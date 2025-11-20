import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKeyboardComponent } from './edit-keyboard.component';

describe('EditKeyboardComponent', () => {
  let component: EditKeyboardComponent;
  let fixture: ComponentFixture<EditKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditKeyboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
