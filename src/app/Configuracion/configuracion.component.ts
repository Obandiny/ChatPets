import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent {

  questions = [
    '¿Cuál es el síntoma principal que presenta tu mascota?',
    '¿Desde hace cuánto presenta ese síntoma?',
    '¿Ha tenido cambios en el apetito o comportamiento?',
    '¿Tu mascota ha tenido fiebre o vómitos recientemente?',
    '¿Ha estado en contacto con otros animales últimamente?'
  ];

  answers: string[] = [];
  currentQuestionIndex = 0;
  currentAnswer = '';
  petId = 0;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.petId = +this.route.snapshot.paramMap.get('id')!;
  }

  next() {
    if (this.currentAnswer.trim() !== '') {
      this.answers.push(this.currentAnswer.trim());
      this.currentAnswer = '';
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.finishDiagnosis();
      }
    }
  }

  finishDiagnosis() {
    const finalPrompt = this.questions.map((q, i) => `${q} ${this.answers[i]}`).join('\n');

    this.http.post<any>('http://localhost:5000/chat', {
      pet_id: this.petId,
      message: finalPrompt
    }).subscribe(response => {
      this.router.navigate(['/chat', this.petId]);
    });
  }

}
