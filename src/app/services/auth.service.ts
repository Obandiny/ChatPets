import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth';

  private http = inject(HttpClient);
  private router = inject(Router);
  private logger = inject(LoggerService);
  private snackbar = inject(MatSnackBar);

  private authStatus = new BehaviorSubject<boolean>(false);

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
    if (!this.isBrowser()) return null;
    
    const token = localStorage.getItem('token');
    if (!token) {
      this.logger.debug('No hay token en localStorage');
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (exp && now >= exp) {
        this.logger.warn('El token ha expirado. Se eliminara.');
        this.logout(true);
        return null;
      }

      this.logger.debug('Token valido obtenido', token);
      return token;
    } catch (error) {
      this.logger.error('Token malformado o ilegible', error);
      return null;
    }
  }

  /** CERRAR SESIÓN */
  logout(showMessage: boolean = true): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      this.logger.warn('token eliminado');
    }

    if (showMessage) {
      this.snackbar?.open('Sesión expirada, por favor inicia sesión de nuevo', 'Cerrar', { duration: 3000 })
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

  getUserInfo(): { nombre: string; apellido: string; rol: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        nombre: payload.nombre || '',
        apellido: payload.apellido || '',
        rol: payload.rol || ''
      };
    } catch (error) {
      this.logger.error('Error al obtener datos del usuario del token', error);
      return null;
    }
  }

  /** OBSERVABLE para escuchar cambios de sesión */
  authStatus$(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  setAuthStatus(status: boolean): void {
    this.authStatus.next(status);
  }
}
