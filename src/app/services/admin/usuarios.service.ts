import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly apiURL = 'http://localhost:5000/api/usuarios';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}`, {
      headers: this.getHeaders()
    });
  }

  actualizarRolUsuario(usuarioId: number, nuevoRol: string): Observable<any> {
    return this.http.put(`${this.apiURL}/${usuarioId}/rol`, {
      rol: nuevoRol
    }, {
      headers: this.getHeaders()
    });
  }

  eliminarUsuario(usuarioId: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${usuarioId}`, {
      headers: this.getHeaders()
    });
  }
}
