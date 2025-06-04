import { TestBed } from '@angular/core/testing';

import { GrowthService } from './growth.service';

describe('GrowthService', () => {
  let service: GrowthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrowthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
