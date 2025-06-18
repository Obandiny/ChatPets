import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {

  private readonly apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  enviarDiagnostico(respuestas: string[], mascotaId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      sintomas: respuestas,
      mascota_id: mascotaId
    };

    this.logger.info('Enviando diagnostico con datos:', body);

    return this.http.post(`${this.apiUrl}/diagnostico`, body, { headers });
  }

  getHistorial(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    this.logger.info('Obteniendo historial de diagnosticos...');
    return this.http.get<any[]>(`${this.apiUrl}/historial`, { headers });
  }

  elimiarHistorial(id: number): Observable<any> {
    this.logger.warn('Eliminando historial con ID:', id);
    return this.http.delete(`${this.apiUrl}/historial/${id}`);
  }

  getDiagnosticoById(id: number): Observable<any> {
    this.logger.debug('Obteniendo diagnostico por ID', id);
    return this.http.get(`${this.apiUrl}/historial/${id}`);
  }
}
