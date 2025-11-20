import { TestBed } from '@angular/core/testing';

import { WeddingCardService } from './wedding-card.service';

describe('WeddingCardService', () => {
  let service: WeddingCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeddingCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
