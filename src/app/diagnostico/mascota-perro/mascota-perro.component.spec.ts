import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaPerroComponent } from './mascota-perro.component';

describe('MascotaPerroComponent', () => {
  let component: MascotaPerroComponent;
  let fixture: ComponentFixture<MascotaPerroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaPerroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotaPerroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
