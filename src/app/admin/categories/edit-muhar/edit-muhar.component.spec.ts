import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMuharComponent } from './edit-muhar.component';

describe('EditMuharComponent', () => {
  let component: EditMuharComponent;
  let fixture: ComponentFixture<EditMuharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMuharComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMuharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
