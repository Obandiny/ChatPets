import { Component, ElementRef, ViewChild } from '@angular/core';
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

    const mensajeUsuario = this.userInput.trim();
    // Agregar el mensaje del usuario
    this.messages.push({ text: mensajeUsuario, isBot: false });
    this.userInput = '';
    this.isBotTyping = true;

    // Recuperar diagnostico base desde localstorage
    const id = localStorage.getItem('diagnostico_id');
    if (!id) {
      this.messages.push({ text: 'No se encontro el diagnostico base', isBot: true });
      this.isBotTyping = false;
      return;
    }

    this.diagnosticoService.getDiagnosticoById(+id).subscribe(diagnostico => {
      const contextoBase = `
      🐾 Mascota: ${diagnostico.nombre_mascota}
      🧬 Edad: ${diagnostico.edad}, Raza: ${diagnostico.raza}, Sexo: ${diagnostico.sexo}, Peso: ${diagnostico.peso}kg
      🦠 Enfermedad detectada: ${diagnostico.enfermedad}
      💊 Recomendación inicial: ${diagnostico.recomendacion}
      `;

      const promptCompleto = `
      CONTEXTO DEL CASO:
      ${contextoBase}


      Pregunta del usuario:
      ${mensajeUsuario}


      Por favor responde en el mismo contexto de la enfermedad detectada para esta mascota.
      `;

      // Enviar el mensaje al backend "python/Flask" a traves del servicio
      this.chatbotService.obtenerRecomendacion(promptCompleto).subscribe({
      next: response => {
        this.isBotTyping = false;
        const respuesta = response.respuesta_mejorada || 'Lo siento, no pude generar una respuesta clara.';
        this.messages.push({ text: respuesta, isBot: true });
      },
      error: (err) => {
        this.isBotTyping = false;
        // En caso de error, mostrar mensaje
        this.messages.push({ text: 'Lo siento, ha ocurrido un error.', isBot: true});
        console.error('Error al obtener la respuesta:', err);
      }
    });

    this.scrollToBottom();
  }); 

  // Limpiar el input  
  this.userInput = '';
  }

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

}
