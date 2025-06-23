import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DiagnosticoService } from '../services/diagnostico.service';
import { MascotaService } from '../services/mascota.service';
import { LoggerService } from '../services/logger.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

interface Diagnostico {
  id: number;
  fecha: string | Date;
  nombre_mascota: string;
  enfermedad: string;
  recomendacion: string;
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
    RouterLinkActive,
    MatSnackBarModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  mensajeBienvenida: string = '';
  isMenuOpen = true;
  submenuAbierto: boolean = false;
  submenuAbiertoAdmin: boolean = false;
  submenuMascotasAbierto: boolean = false;
  rol: string | null = null;
  mascotaRegistrada: boolean = false;
  mascotas: any[] = [];

  historial: any[] = [];

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
    private diagnosticoService: DiagnosticoService,
    private mascotaService: MascotaService,
    private logger: LoggerService,
    private snackBar: MatSnackBar,
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

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.diagnosticoService.getHistorial().subscribe(data => {
          this.historial = data
            .map((item: any) => ({
              ...item,
              fecha: new Date(item.fecha)
            }))
            .slice(0, 5);
        });
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      this.startCarousel();
    }

    this.verificarMascotaRegistrada();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  verChat(id: number): void {
    localStorage.setItem('diagnostico_id', id.toString());
    this.router.navigate(['/chatbot']);
  }

  cargarMascotas() {
    this.mascotaService.getMisMascotas().subscribe({
      next: (data) => this.mascotas = data,
      error: (err) => this.logger.error('Error cargando mascotas:', err)
    });
  }

  toggleSubmenuMascotas() {
    this.submenuMascotasAbierto = !this.submenuMascotasAbierto;
    if (this.submenuMascotasAbierto) this.cargarMascotas();
  }

  irADiagnostico(mascotaId: number) {
    this.router.navigate(['/diagnostico/mascota-perro'], { queryParams: { id: mascotaId } });
  }

  eliminar(id: number): void {
    this.diagnosticoService.elimiarHistorial(id).subscribe({
      next: () => {
        this.historial = this.historial.filter(h => h.id !== id);
        this.snackBar.open('Historial eliminado correctamente.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
      },
      error: (err) => {
        this.logger.error('Error al elimiar el historial:', err);
        this.snackBar.open('Error al eliminar el historial.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubmenu() {
    this.submenuAbierto = !this.submenuAbierto;
  }

  toggleSubmenuAdmin() {
    this.submenuAbiertoAdmin = !this.submenuAbiertoAdmin;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // loadHistorial(): void {
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     const historialJSON = localStorage.getItem('historialDiagnosticos');
  //     if (historialJSON) {
  //       this.historialDiagnosticos = JSON.parse(historialJSON).map((item: any) => ({
  //         ...item,
  //         fecha: new Date(item.fecha)
  //       }));
  //     }
  //   } else {
  //     this.historialDiagnosticos = [];
  //   }
  // }

  // verDetalle(item: Diagnostico): void {
  //   console.log('Detalle del diagnóstico:', item);
  // }

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

  verificarMascotaRegistrada() {
    if (isPlatformBrowser(this.platformId)) {
      const mascota = localStorage.getItem('mascota');
      this.mascotaRegistrada = !mascota;
    }
  }
}
