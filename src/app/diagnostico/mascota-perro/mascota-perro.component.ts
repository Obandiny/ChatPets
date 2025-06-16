import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../services/chatbot.service';
import { response } from 'express';

@Component({
  selector: 'app-mascota-perro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './mascota-perro.component.html',
  styleUrls: ['./mascota-perro.component.css']
})
export class MascotaPerroComponent {

  questions = [
    '¿Cuál es el síntoma principal que presenta tu mascota?',
    '¿Desde hace cuánto presenta ese síntoma?',
    '¿Ha tenido cambios en el apetito o comportamiento?',
    '¿Tu mascota ha tenido fiebre o vómitos recientemente?',
    '¿Ha estado en contacto con otros animales últimamente?'
  ];

  answers: string[] = Array(this.questions.length).fill('');

  currentQuestionIndex = 0;

  constructor(private chatbotService: ChatbotService) {}

  get currentAnswer(): string {
    return this.answers[this.currentQuestionIndex];
  }

  set currentAnswer(value: string) {
    this.answers[this.currentQuestionIndex] = value;
  }

  before(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  next(): void {
    const respuesta = this.answers[this.currentQuestionIndex]?.trim();
    if (respuesta !== '') {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.finishDiagnosis();
      }
    }
  }

  isFirstQuestion(): boolean {
    return this.currentQuestionIndex === 0;
  }

  isAnswerEmpty(): boolean {
    return this.answers[this.currentQuestionIndex]?.trim() === '';
  }

  getInputType(index: number): string {
    if (index === 1) {
      return 'number';
    }
    return 'text';
  }

  finishDiagnosis() {
    const mascota = JSON.parse(localStorage.getItem('mascota')!);
    const diagnostico = {
      ...mascota,
      respuestas: this.answers
    };
    this.chatbotService.enviarDiagnostico(diagnostico).subscribe(response => {
      console.log('Diagnostico enviado:', response);
    });
  }

}
