import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticoDetalleComponent } from './diagnostico-detalle.component';

describe('DiagnosticoDetalleComponent', () => {
  let component: DiagnosticoDetalleComponent;
  let fixture: ComponentFixture<DiagnosticoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticoDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
