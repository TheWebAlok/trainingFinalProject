import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiminationComponent } from './limination.component';

describe('LiminationComponent', () => {
  let component: LiminationComponent;
  let fixture: ComponentFixture<LiminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiminationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
