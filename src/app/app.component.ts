import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from "./chatbot/chatbot.component";
import { AuthService } from './services/auth.service';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatPETs';

  constructor (
    private auth: AuthService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    const token = this.auth.getToken();
    if (token) {
      this.logger.success('Token detectado al iniciar la app');
      this.auth.setAuthStatus(!!token);
    } else {
      this.logger.warn('No se encontro token al inicar la app');
    }
  }
}
