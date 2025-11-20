import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMuharComponent } from './add-muhar.component';

describe('AddMuharComponent', () => {
  let component: AddMuharComponent;
  let fixture: ComponentFixture<AddMuharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMuharComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMuharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
