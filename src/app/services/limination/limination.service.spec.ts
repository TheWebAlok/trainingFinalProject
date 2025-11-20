import { TestBed } from '@angular/core/testing';

import { LiminationService } from './limination.service';

describe('LiminationService', () => {
  let service: LiminationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiminationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
