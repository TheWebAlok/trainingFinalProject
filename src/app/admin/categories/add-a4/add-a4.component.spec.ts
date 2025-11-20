import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddA4Component } from './add-a4.component';

describe('AddA4Component', () => {
  let component: AddA4Component;
  let fixture: ComponentFixture<AddA4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddA4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddA4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
