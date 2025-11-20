import { TestBed } from '@angular/core/testing';

import { MuharService } from './muhar.service';

describe('MuharService', () => {
  let service: MuharService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuharService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
