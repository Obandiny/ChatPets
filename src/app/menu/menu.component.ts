import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  isMenuOpen = true;
  rol: string | null = null;
  historialDiagnosticos: any[] = []; // Simulación por ahora

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.rol = this.authService.getRole();
    this.loadHistorial(); // Simulado
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  loadHistorial(): void {
    // Aquí llamarías a tu backend para obtener el historial por usuario logueado
    this.historialDiagnosticos = [
      { fecha: new Date(), mascota: 'Firulais' },
      { fecha: new Date(), mascota: 'Max' }
    ];
  }

  verDetalle(item: any): void {
    console.log('Ver detalles del historial:', item);
    // Aquí podrías abrir un modal o navegar a detalle del diagnóstico
  }
}
