import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    // Simulación de login exitoso
    if (data.email === 'admin@mascotapp.com' && data.password === '123456') {
      return of({ token: 'fake-jwt-token' });
    }

    return throwError(() => new Error('Credenciales inválidas'));
  }

  register(data: { email: string; password: string }): Observable<any> {
    // Aquí iría tu llamada real al backend (por ejemplo):
    // return this.http.post('http://tuapi.com/register', data);

    // Simulación de registro exitoso
    return of({ message: 'Usuario registrado exitosamente' });
  }
}
