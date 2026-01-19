import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';
import { isPlatformBrowser } from '@angular/common';
import { platformBrowser } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {

  private readonly apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  enviarDiagnostico(respuestas: string[], mascotaId: number): Observable<any> {
    try {
      if (!isPlatformBrowser(this.platformId)) {
        this.logger.warn('No se puede acceder al localStorage: no es un navegador');
        throw new Error('No se puede ejecutar en un entorno no navegador');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        this.logger.error('Token no encontrado en localStorage');
        throw new Error('Token no disponible');
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const body = {
        sintomas: respuestas,
        mascota_id: mascotaId
      };

      this.logger.info('Enviando diagnóstico con los siguientes datos:', body);

      return this.http.post(`${this.apiUrl}/diagnostico`, body, { headers });

    } catch (error) {
      this.logger.error('Error al preparar el envío del diagnóstico:', error);
      throw error; // Re-lanzamos el error para que Angular lo capture en el .subscribe
    }
  }

  getHistorial(): Observable<any[]> {
    let headers = {};
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      headers = {
        Authorization: `Bearer ${token}`
      };
    }

    this.logger.info('Obteniendo historial de diagnosticos...');
    return this.http.get<any[]>(`${this.apiUrl}/historial`, { headers });
  }

  elimiarHistorial(id: number): Observable<any> {
    let headers = {};
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      headers = {
        Authorization: `Bearer ${token}`
      };
    }

    this.logger.warn('Eliminando historial con ID:', id);
    return this.http.delete(`${this.apiUrl}/historial/${id}`, { headers });
  }

  getDiagnosticoById(id: number): Observable<any> {
    let headers = {};
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.logger.warn('No se encontró el token para getDiagnosticoById');
      }
      headers = {
        Authorization: `Bearer ${token}`
      };
    }

    this.logger.info('Obteniendo diagnostico por ID con headers:', headers);
    return this.http.get(`${this.apiUrl}/historial/${id}`, { headers });
  }
}
