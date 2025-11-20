import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPrinterComponent } from './all-printer.component';

describe('AllPrinterComponent', () => {
  let component: AllPrinterComponent;
  let fixture: ComponentFixture<AllPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPrinterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
