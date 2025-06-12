import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarMascotaComponent } from './registar-mascota.component';

describe('RegistarMascotaComponent', () => {
  let component: RegistarMascotaComponent;
  let fixture: ComponentFixture<RegistarMascotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistarMascotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarMascotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
