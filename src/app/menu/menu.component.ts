import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
<<<<<<< HEAD
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

=======
import { Router, RouterLink } from '@angular/router';
>>>>>>> 8007e33 (Ajustes graficos del menu)

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

<<<<<<< HEAD
  constructor(public authService: AuthService) {}
=======
  constructor(private router: Router) {}
>>>>>>> 8007e33 (Ajustes graficos del menu)

  ngOnInit(): void {
    this.rol = this.authService.getRole();
    this.loadHistorial(); // Simulado
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

<<<<<<< HEAD
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
=======
  logout() {
    localStorage.removeItem('token'); // o sessionStorage.clear(); si usas sesión
    this.router.navigate(['/auth/login']);
>>>>>>> 8007e33 (Ajustes graficos del menu)
  }
}
