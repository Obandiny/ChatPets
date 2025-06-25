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
import { LoggerService } from '../services/logger.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatIconModule,
    MatSnackBarModule
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
    private diagnosticoService: DiagnosticoService,
    private logger: LoggerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('diagnostico_id');
    this.messages = this.mensajeServie.getMensajes();

    this.logger.debug('Mensajes iniciales:', this.messages);

    if (id) {
      this.logger.info('Consultando diagnostico con ID:', id);
      this.diagnosticoService.getDiagnosticoById(+id).subscribe(data => {
        this.logger.success('Diagnostico recuperado:', data);
        this.messages = [
          { text: `🐾 Mascota: ${data.nombre_mascota}`, isBot: true },
          // { text: `🦠 Enfermedad: ${data.enfermedad}`, isBot: true },
          { text: `💊 Recomendación: ${data.recomendacion}`, isBot: true }
        ];
      }, error => {
        this.logger.error('Error al recuperar diagnostico por ID', error);
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
    this.logger.debug('Mensaje enviado por usuario', mensajeUsuario);
    this.userInput = '';
    this.isBotTyping = true;

    // Recuperar diagnostico base desde localstorage
    const id = localStorage.getItem('diagnostico_id');
    if (!id) {
      this.messages.push({ text: 'No se encontro el diagnostico base', isBot: true });
      this.isBotTyping = false;
      return;
    }

    if (this.messages.filter(m => !m.isBot).length === 1) {
      this.diagnosticoService.getDiagnosticoById(+id).subscribe(diagnostico => {
        const contextoBase = `
        🐾 Mascota: ${diagnostico.nombre_mascota}
        🧬 Edad: ${diagnostico.edad}, Raza: ${diagnostico.raza}, Peso: ${diagnostico.peso}kg, Tamaño: ${diagnostico.Tamaño}
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
    }); 

    } else {
      // Preguntas posteriores
      this.chatbotService.continuarConversacion(+id, mensajeUsuario).subscribe({
        next: (response) => {
          this.isBotTyping = false;
          this.messages.push({ text: response.respuesta, isBot: true });
        },
        error: (err) => {
          this.isBotTyping = false;
          this.messages.push({ text: 'Error al continuar conversacion.',  isBot: true});
          this.logger.error('Error en la conversacion', err);
        }
      });

      this.scrollToBottom();
    }

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

  formatBotMessage(text: string): string {
  // Negrita con **
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Saltos de línea (si hay \n en el texto)
  formatted = formatted.replace(/\n/g, '<br>');

  // Reemplaza listas numeradas o con guion si existieran
  formatted = formatted.replace(/(\d+)\.\s+/g, '<br><strong>$1.</strong> ');
  formatted = formatted.replace(/•\s+/g, '<br>• '); // si usas bullets

  // Opcional: resalta "Recomendaciones para el dueño"
  formatted = formatted.replace(/(Recomendaciones para el dueño:)/g, '<u><strong>$1</strong></u>');

  // Enlaces WhatsApp
  formatted = formatted.replace(
    /(https:\/\/wa\.me\/[0-9]+(\?text=[^\s]*)?)/g,
    '<a href="$1" target="_blank" style="color: #2ea44f; text-decoration: underline;">$1</a>'
  );

  return formatted;
  }

}
