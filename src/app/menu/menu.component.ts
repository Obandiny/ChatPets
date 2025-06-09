import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isMenuOpen: boolean = true;
  rol: string | null = null;
  historialDiagnosticos: { fecha: Date, mascota: string }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol = this.authService.getRole();
    this.loadHistorial();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  loadHistorial(): void {
    // Simulación: reemplaza esto por llamada a servicio real
    this.historialDiagnosticos = [
      { fecha: new Date(), mascota: 'Firulais' },
      { fecha: new Date(), mascota: 'Max' }
    ];
  }

  verDetalle(item: { fecha: Date, mascota: string }): void {
    console.log('Ver detalles del historial:', item);
    // Aquí podrías abrir un modal o redirigir a otra vista
  }
}
