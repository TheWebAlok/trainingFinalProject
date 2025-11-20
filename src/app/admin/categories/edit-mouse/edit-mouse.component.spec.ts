import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMouseComponent } from './edit-mouse.component';

describe('EditMouseComponent', () => {
  let component: EditMouseComponent;
  let fixture: ComponentFixture<EditMouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMouseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
