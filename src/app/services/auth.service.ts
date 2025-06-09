import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth';

  private http = inject(HttpClient);
  private router = inject(Router);
  private logger = inject(LoggerService);

  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  /** REGISTRO */
  register(data: any): Observable<any> {
    this.logger.info('Registro de usuario iniciado', data?.correo);
    return this.http.post(`${this.API_URL}/register`, data);
  }

  /** LOGIN */
  login(data: any): Observable<any> {
    this.logger.info('Intento de login', data?.correo);
    return this.http.post(`${this.API_URL}/login`, data);
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      this.logger.success('Token guardado en localStorage');
      this.authStatus.next(true);
    }
  }

  /** OBTENER TOKEN */
  getToken(): string | null {
    const token = this.isBrowser() ? localStorage.getItem('token') : null;
    this.logger.debug('Token obtenido', token);
    return token;
  }

  /** CERRAR SESIÓN */
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      this.logger.warn('Sesión cerrada, token eliminado');
    }
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  /** VERIFICAR SI EL USUARIO ESTÁ LOGUEADO */
  isLoggedIn(): boolean {
    const logged = !!this.getToken();
    this.logger.debug('¿Usuario logueado?', logged);
    return logged;
  }

  /** DECODIFICAR TOKEN y OBTENER ROL */
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.logger.debug('Rol obtenido del token', payload.rol);
      return payload.rol;
    } catch (error) {
      this.logger.error('Error al obtener el rol del token', error);
      return null;
    }
  }

  /** OBTENER ID DEL USUARIO LOGUEADO */
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.logger.debug('ID de usuario obtenido del token', payload.user_id);
      return payload.user_id;
    } catch (error) {
      this.logger.error('Error al obtener el ID del token', error);
      return null;
    }
  }

  /** OBSERVABLE para escuchar cambios de sesión */
  authStatus$(): Observable<boolean> {
    return this.authStatus.asObservable();
  }
}
