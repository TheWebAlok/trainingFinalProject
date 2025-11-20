import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAppointmentComponent } from './service-appointment.component';

describe('ServiceAppointmentComponent', () => {
  let component: ServiceAppointmentComponent;
  let fixture: ComponentFixture<ServiceAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
