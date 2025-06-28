import { TestBed } from '@angular/core/testing';

import { MascotasService } from '../admin/mascotas.service';

describe('MascotasService', () => {
  let service: MascotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MascotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
