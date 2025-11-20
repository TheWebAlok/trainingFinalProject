import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditA4Component } from './edit-a4.component';

describe('EditA4Component', () => {
  let component: EditA4Component;
  let fixture: ComponentFixture<EditA4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditA4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditA4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
