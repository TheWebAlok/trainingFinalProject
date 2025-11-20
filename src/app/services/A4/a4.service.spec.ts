import { TestBed } from '@angular/core/testing';

import { A4Service } from './a4.service';

describe('A4Service', () => {
  let service: A4Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(A4Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
