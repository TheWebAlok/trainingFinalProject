import { ComponentFixture, TestBed } from '@angular/core/testing';

import { A4papperComponent } from './a4papper.component';

describe('A4papperComponent', () => {
  let component: A4papperComponent;
  let fixture: ComponentFixture<A4papperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A4papperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(A4papperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
