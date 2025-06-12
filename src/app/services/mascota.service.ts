import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private readonly API_URL = 'http://localhost:5000/api/';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registrarMascota(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.API_URL}/mascotas`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
