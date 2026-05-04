import { TestBed } from '@angular/core/testing';

import { CheckItem } from './check-item';

describe('CheckItem', () => {
  let service: CheckItem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckItem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
