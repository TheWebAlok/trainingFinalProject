import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButItemComponent } from './but-item.component';

describe('ButItemComponent', () => {
  let component: ButItemComponent;
  let fixture: ComponentFixture<ButItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
