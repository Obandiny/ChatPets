import { TestBed } from '@angular/core/testing';

import { MensajeService } from './services/mensaje.service';

describe('MensajeService', () => {
  let service: MensajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
