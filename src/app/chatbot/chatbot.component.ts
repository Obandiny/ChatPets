import { Component } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { error } from 'console';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon'
import { MensajeService } from '../services/mensaje.service';
import { DiagnosticoService } from '../services/diagnostico.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterLink,
    MatTooltipModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userInput: string = '';
  messages: {  text: string, isBot: boolean }[] = [];
  isAsideOpen: boolean = false;
  isBotTyping: boolean = false;
  isModalOpen: boolean = false;
  isModalOpenAside: boolean = false;

  constructor(
    public chatbotService: ChatbotService,
    private mensajeServie: MensajeService,
    private diagnosticoService: DiagnosticoService
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('diagnostico_id');
    this.messages = this.mensajeServie.getMensajes();

    if (id) {
      this.diagnosticoService.getDiagnosticoById(+id).subscribe(data => {
        this.messages = [
          { text: `🐾 Mascota: ${data.nombre_mascota}`, isBot: true },
          { text: `🦠 Enfermedad: ${data.enfermedad}`, isBot: true },
          { text: `💊 Recomendación: ${data.recomendacion}`, isBot: true }
        ];
      }); 
    }
  }
  
  nuevoChat() {
    this.messages = [];
    this.userInput = '';
    this.isBotTyping = false;
  }

  sendMessage() {
    if (this.userInput.trim() === '') return;

    // Agregar el mensaje del usuario
    this.messages.push({ text: this.userInput, isBot: false});
    this.userInput = '';
    this.isBotTyping = true;

    // Enviar el mensaje al backend "python/Flask" a traves del servicio
    this.chatbotService.obtenerRecomendacion(this.userInput).subscribe({
      next: response => {
        this.isBotTyping = false;
        // this.messages.push({ text: response.response, isBot: true });
        
        if (response.respuesta_mejorada) {
          this.messages.push({ text: response.respuesta_mejorada, isBot: true }); 
        } else {
          this.messages.push({ text: 'Lo siento, no pude encontrar una respuesta.', isBot: true });
        }

    },
      error: (err) => {
        this.isBotTyping = false;
        // En caso de error, mostrar mensaje
        this.messages.push({ text: 'Lo siento, ha ocurrido un error.', isBot: true});
        console.error('Error al obtener la respuesta:', err);
    }
  }); 

  // Limpiar el input  
  this.userInput = '';
  }

  typeBotResponse(response: string) {
    let i = 0;
    const botMessage = { text: '', isBot: true };
    this.messages.push(botMessage);
    const interval = setInterval(() => {
      if (i < response.length) {
        botMessage.text += response[i];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  }

}
