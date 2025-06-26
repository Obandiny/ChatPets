import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {

  private apiUrl = 'http://localhost:5000'

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  obtenerRecomendacion(userInput: string): Observable<any> {
    const mascotaId = Number(localStorage.getItem('mascota_id'));
    const token = localStorage.getItem('token');

    const body = {
      respuestas: [userInput],
      mascota_id: mascotaId
    };

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.post<any>(`${this.apiUrl}/api/chat`, body, { headers });
  }

  enviarDiagnostico(data: any) {
    return this.http.post(`${this.apiUrl}/api/diagnostico`, data);
  }

  continuarConversacion(diagnosticoId: number, pregunta: string): Observable<any> {
    let headers = {};
    if (!isPlatformBrowser(this.platformId)) {
      this.logger.warn('No se puede acceder al localstorage.');
    }

    const token = localStorage.getItem('token');
    headers = {
      Authorization: `Bearer ${token}`
    };

    const body = {
      pregunta: pregunta,
      diagnostico_id: diagnosticoId
    };  

    this.logger.info('Obteniendo conversacion adicional...');
    return this.http.post(`${this.apiUrl}/continuar`, body, { headers });
  }
}

