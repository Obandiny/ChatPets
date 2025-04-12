import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {

  private isDarkTheme = false;

  private apiUrl = 'http://localhost:5000'

  constructor(private http: HttpClient) { }

  obtenerRecomendacion(userInput: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/chat`, { sintomas: userInput });
  }
 
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  get currentThemeIsDark() {
    return this.isDarkTheme;
  }

}
