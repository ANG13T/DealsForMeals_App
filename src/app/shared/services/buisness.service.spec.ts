import { TestBed } from '@angular/core/testing';

import { BuisnessService } from './buisness.service';

describe('BuisnessService', () => {
  let service: BuisnessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuisnessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
