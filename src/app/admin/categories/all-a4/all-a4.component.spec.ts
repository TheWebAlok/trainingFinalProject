import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllA4Component } from './all-a4.component';

describe('AllA4Component', () => {
  let component: AllA4Component;
  let fixture: ComponentFixture<AllA4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllA4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllA4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
