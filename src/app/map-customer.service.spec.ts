import { TestBed } from '@angular/core/testing';

import { MapCustomerService } from './map-customer.service';

describe('MapCustomerService', () => {
  let service: MapCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
