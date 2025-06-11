import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Diagnostico {
  fecha: Date;
  mascota: string;
}

interface Tip {
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  mensajeBienvenida: string = '';
  isMenuOpen = true;
  rol: string | null = null;
  historialDiagnosticos: Diagnostico[] = [];
  tips: Tip[] = [
    {
      titulo: '¡Protege las patas de tu perro durante el paseo!',
      descripcion: 'En días calurosos, el asfalto puede alcanzar temperaturas peligrosas para las almohadillas de tu canino. Coloca tu mano sobre el suelo durante 5 segundos; si está muy caliente para ti, también lo está para tu mascota. Prefiere paseos temprano o al atardecer.'
    },
    {
      titulo: 'Hidrata bien a tu mascota',
      descripcion: 'Asegúrate de que tu perro siempre tenga agua fresca y limpia, especialmente después de los paseos o en días calurosos.'
    },
    {
      titulo: 'Cepilla su pelaje regularmente',
      descripcion: 'El cepillado ayuda a mantener la piel sana y el pelaje libre de nudos, además de fortalecer el vínculo con tu mascota.'
    }
  ];
  currentTipIndex = 0;
  carouselInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const info = this.authService.getUserInfo();

    if (info) {
      this.mensajeBienvenida = info.rol === 'admin'
        ? `Bienvenido Administrador`
        : `Bienvenido ${info.nombre} ${info.apellido}`;
    }
  }

  ngOnInit(): void {
    this.rol = this.authService.getRole();
    this.loadHistorial();

    if (isPlatformBrowser(this.platformId)) {
      this.startCarousel();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  loadHistorial(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const historialJSON = localStorage.getItem('historialDiagnosticos');
      if (historialJSON) {
        this.historialDiagnosticos = JSON.parse(historialJSON).map((item: any) => ({
          ...item,
          fecha: new Date(item.fecha)
        }));
      }
    } else {
      this.historialDiagnosticos = [];
    }
  }

  verDetalle(item: Diagnostico): void {
    console.log('Detalle del diagnóstico:', item);
  }

  getTransform(): string {
    return `translateX(-${this.currentTipIndex * 100}%)`;
  }

  prevTip(): void {
    this.currentTipIndex = (this.currentTipIndex - 1 + this.tips.length) % this.tips.length;
  }

  nextTip(): void {
    this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
  }

  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.nextTip();
    }, 5000);
  }
}
