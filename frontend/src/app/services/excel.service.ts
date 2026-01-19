import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private apiUrl = 'http://localhost:5000/';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  validarArchivo(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const headers = this.buildAuthHeader();
    return this.http.post<any>(`${this.apiUrl}/validar`, formData, { headers }) 
  }

  subirArchivoProgreso(archivo: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const headers = this.buildAuthHeader();
    return this.http.post<any>(`${this.apiUrl}/importar-excel`, formData, {
      reportProgress: true,
      observe: 'events',
      headers
    }); 
  }

  private buildAuthHeader(): HttpHeaders | {} {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
      }
    }
    return {};
  }
}
