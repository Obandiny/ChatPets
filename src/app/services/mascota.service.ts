import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private readonly API_URL = 'http://localhost:5000/api/mascota';

  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  registrarMascota(data: FormData): Observable<any> {
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

  guardarSeguimiento(datos: any): Observable<any> {

    try {
      const token = localStorage.getItem('token');
  
      this.logger.info('Enviando modifcacion...');
      return this.http.post(`${this.API_URL}/seguimiento`, datos, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      this.logger.error('Error en guardar la modificacion.');
      throw error;
    }
  }
}
