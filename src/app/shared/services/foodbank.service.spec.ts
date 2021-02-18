import { TestBed } from '@angular/core/testing';

import { FoodbankService } from './foodbank.service';

describe('FoodbankService', () => {
  let service: FoodbankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodbankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
