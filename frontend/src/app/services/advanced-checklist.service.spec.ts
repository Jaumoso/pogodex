import { TestBed } from '@angular/core/testing';

import { AdvancedChecklistService } from './advanced-checklist.service';

describe('AdvancedChecklistService', () => {
  let service: AdvancedChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancedChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
