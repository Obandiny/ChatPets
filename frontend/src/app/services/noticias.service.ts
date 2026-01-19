import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';

export interface Noticia {
  titulo: string;
  descripcion: string;
  imagen: string;
  url: string;
  fecha: string;
  fuente: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  private readonly apiUrl = "http://localhost:5000/api";

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  obtenerNoticias(pagina = 1): Observable<any> {
    let headers = {};
    if (!isPlatformBrowser(this.platformId)) {
      this.logger.warn('No se puede acceder al localstorage.');
      const token = localStorage.getItem('token');

      headers = {
        Authorization: `Bearer ${token}`
      }
    }

    this.logger.info('Obteniendo noticias de la API...');
    return this.http.get(`${this.apiUrl}/noticias/?page=${pagina}`, { headers });
  }
}
