import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private readonly API_URL = 'http://localhost:5000/api/mascota';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registrarMascota(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token enviado:', token);

    return this.http.post(`${this.API_URL}/registrar`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getMisMascotas(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.API_URL}/mis-mascotas`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getMascotaById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
