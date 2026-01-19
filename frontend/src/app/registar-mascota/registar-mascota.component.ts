import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MascotaService } from '../services/mascota.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from '../services/logger.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { from } from 'rxjs';

interface ChatMessage {
  from: 'user' | 'bot';
  text?: string;
  img?: string;
}

@Component({
  selector: 'app-registar-mascota',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    // RouterLink,
    MatCardModule
  ],
  templateUrl: './registar-mascota.component.html',
  styleUrl: './registar-mascota.component.css'
})

export class RegistarMascotaComponent {
  
  @ViewChild('chatWindow') chatWindow!: ElementRef;

  currentAnswer = '';
  step = 0;
  isTyping = false;
  imageRequired = false;

  selectedImageFile: File | null = null;
  previewImageUrl: string | null = null;

  mascotaData: any = {
    nombre: '',
    raza: '',
    edad: '',
    peso: '',
    tamano: '',
  };

  steps = [
    '¿Cuál es el nombre de tu mascota?',
    'Perfecto 😊 ¿Qué raza es?',
    '¿Cuántos años tiene?',
    '¿Cuánto pesa? (kg)',
    '¿de qué tamaño es? (Pequeño, Mediano o Grande)'
  ];

  messages: ChatMessage[] = [
    { from: 'bot', text: '¡Hola! Vamos a registrar tu mascota 🐾' },
    { from: 'bot', text: '¿Cuál es el nombre de tu mascota?' },
  ];

  constructor(
    private mascotaService: MascotaService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}


  goBack() {
    this.router.navigate(['/menu']);
  }

  sendMessage() {
    let text = this.currentAnswer.trim();
    if (!text) return;

    text = this.limpiarRespuesta(text);
    if (!text) return;

    // Mostrar burbuja usuario
    this.messages.push({ from: 'user', text });
    this.scrollToBottom();
    this.currentAnswer = '';

    // Validar según paso
    if (!this.validateAnswer(text)) return;

    // Guardar dato
    const keys = ['nombre', 'raza', 'edad', 'peso', 'tamano'];
    this.mascotaData[keys[this.step]] = text;

    this.step++;

    // Si aún hay preguntas
    if (this.step < this.steps.length) {
      this.showTyping(this.steps[this.step]);
    } else {
      this.finishRegistration();
    }
  }

  validateAnswer(answer: string): boolean {
    // Validación edad
    if (this.step === 2 && isNaN(Number(answer))) {
      this.botReply('Por favor escribe un número válido para la edad.');
      return false;
    }

    // Validación peso
    if (this.step === 3 && isNaN(Number(answer))) {
      this.botReply('El peso debe ser numérico en kg.');
      return false;
    }

    // Validación tamaño
    if (this.step === 4) {
      const val = answer.toLowerCase();
      if (!['pequeño', 'mediano', 'grande'].includes(val)) {
        this.botReply('El tamaño debe ser: Pequeño, Mediano o Grande.');
        return false;
      }
    }

    return true;
  }

  botReply(text: string) {
    this.showTyping(text);
  }

  showTyping(nextMessage: string | ChatMessage) {
    this.isTyping = true;
    this.scrollToBottom();

    setTimeout(() => {
      this.isTyping = false;

      if (typeof nextMessage === 'string') {
        this.messages.push({ from: 'bot', text: nextMessage });
      }
      else {
        this.messages.push({
          from: 'bot',
          text: nextMessage.text ?? undefined,
          img: nextMessage.img ?? undefined
        });
      }

      this.scrollToBottom();
    }, 700);
  }

  finishRegistration() {
    this.botReply('Perfecto. Ahora sube una foto de tu mascota antes de continuar 📸🐶');
    this.imageRequired = true;
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatWindow) {
        const el = this.chatWindow.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }

  limpiarRespuesta(texto: string): string {
    if (!texto) return texto;

    let t = texto.toLowerCase();

    const filtros = [
      'se llama',
      'mi mascota se llama',
      'mi perro se llama',
      'nombre es',
      'es',
      'mi perro pesa',
      'mi perro es raza',
      ':',
      'es raza',
      'tiene años',
      'pesa KG',
      'es tamaño'
    ];

    filtros.forEach(f => {
      t = t.replace(f, '');
    });

    t = t.replace(/[^a-zA-Z0-9áéíóúñ ]/g, '');

    t = t.trim();

    if (t.split(' ').length > 3 && this.step === 0) {
      this.botReply('Solo necesito el nombre, por favor');
      return '';
    }

    return t;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.botReply('Por favor selecciona una imagen valida');
      return;
    }

    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImageUrl = reader.result as string;

      this.messages.push({
        from: 'user',
        text: 'Foto cargada',
        img: this.previewImageUrl
      });

      this.scrollToBottom();

      this.imageRequired = false;

      this.registrarMascotaFinal();
    };
    
    reader.readAsDataURL(file);
  }

  registrarMascotaFinal() {
    this.botReply('Registrando mascota… 🐶✨');

    const formData = new FormData();
    formData.append('nombre', this.mascotaData.nombre);
    formData.append('raza', this.mascotaData.raza);
    formData.append('edad', this.mascotaData.edad);
    formData.append('peso', this.mascotaData.peso);
    formData.append('tamano', this.mascotaData.tamano);

    if (this.selectedImageFile) {
      formData.append('imagen', this.selectedImageFile);
    }

    this.mascotaService.registrarMascota(formData).subscribe({
      next: () => {
        this.showTyping('¡Mascota registrada con éxito! 🎉');
        setTimeout(() => this.router.navigate(['/menu']), 1500);
      },
      error: () => {
        this.botReply('Ocurrió un error al registrar la mascota 😿');
      },
    });
  }
}