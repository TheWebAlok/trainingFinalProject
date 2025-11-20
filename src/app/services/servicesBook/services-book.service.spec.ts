import { TestBed } from '@angular/core/testing';

import { ServicesBookService } from './services-book.service';

describe('ServicesBookService', () => {
  let service: ServicesBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
