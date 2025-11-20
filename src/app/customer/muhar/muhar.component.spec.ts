import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuharComponent } from './muhar.component';

describe('MuharComponent', () => {
  let component: MuharComponent;
  let fixture: ComponentFixture<MuharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuharComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
