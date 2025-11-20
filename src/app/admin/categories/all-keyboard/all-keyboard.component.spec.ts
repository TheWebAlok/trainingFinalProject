import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllKeyboardComponent } from './all-keyboard.component';

describe('AllKeyboardComponent', () => {
  let component: AllKeyboardComponent;
  let fixture: ComponentFixture<AllKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllKeyboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
