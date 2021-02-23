import { TestBed } from '@angular/core/testing';

import { FoodieService } from './foodie.service';

describe('FoodieService', () => {
  let service: FoodieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
