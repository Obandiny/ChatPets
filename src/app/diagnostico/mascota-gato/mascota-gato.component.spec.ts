import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaGatoComponent } from './mascota-gato.component';

describe('MascotaGatoComponent', () => {
  let component: MascotaGatoComponent;
  let fixture: ComponentFixture<MascotaGatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaGatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotaGatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
