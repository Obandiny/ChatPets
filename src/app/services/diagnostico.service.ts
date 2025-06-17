import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {

  private readonly apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient
  ) { }

  enviarDiagnostico(respuestas: string[], mascotaId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      respuestas: respuestas,
      mascota_id: mascotaId
    };

    return this.http.post(`${this.apiUrl}/diagnostico`, body, { headers });
  }

  getHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`);
  }

  elimiarHistorial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/historial/${id}`);
  }

  getDiagnosticoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial/${id}`);
  }
}
