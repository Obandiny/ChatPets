import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MenuComponent,      // tu componente standalone
        MatIconModule,      // para mat-icon
        MatTooltipModule,   // para matTooltip
        RouterTestingModule // para RouterLink y navegación en pruebas
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the MenuComponent', () => {
    expect(component).toBeTruthy();
  });

  // Puedes agregar más pruebas aquí según tus necesidades
});
