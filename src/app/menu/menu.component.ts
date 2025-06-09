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
    MatIconModule,
    RouterLink,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']  
})
export class MenuComponent implements OnInit {
  isMenuOpen = true;
  rol: string | null = null;
  historialDiagnosticos: any[] = []; // Simulación por ahora

  // Inyectamos el AuthService y Router
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.rol = this.authService.getRole();
    this.loadHistorial(); // Simulado
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    // Si quieres navegar a login después del logout:
    this.router.navigate(['/auth/login']);
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
