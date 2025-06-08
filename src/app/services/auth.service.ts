import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth'; // Cambia por tu URL real si está desplegado
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());

  private http = inject(HttpClient);
  private router = inject(Router);

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  /** REGISTRO */
  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  /** LOGIN */
  login(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data);
  }

 saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      this.authStatus.next(true);
    }
  }

  /** OBTENER TOKEN */
  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }

  /** CERRAR SESIÓN */
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  /** VERIFICAR SI EL USUARIO ESTÁ LOGUEADO */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** DECODIFICAR TOKEN y OBTENER ROL */
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol;
    } catch {
      return null;
    }
  }

  /** OBTENER ID DEL USUARIO LOGUEADO */
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    } catch {
      return null;
    }
  }

  /** OBSERVABLE para escuchar cambios de sesión */
  authStatus$(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

}
