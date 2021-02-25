import { TestBed } from '@angular/core/testing';

import { BuisnessFeedService } from './buisness-feed.service';

describe('BuisnessFeedService', () => {
  let service: BuisnessFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuisnessFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
