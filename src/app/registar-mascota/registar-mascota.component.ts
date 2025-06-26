import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascotaService } from '../services/mascota.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from '../services/logger.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

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
    RouterLink,
    MatCardModule
  ],
  templateUrl: './registar-mascota.component.html',
  styleUrl: './registar-mascota.component.css'
})
export class RegistarMascotaComponent {
  isMenuOpen = true;
  isMobile = false;

  stepLabels = ['Nombre', 'Raza', 'Edad', 'Peso', 'Tamaño'];

  mascotaForm = this.fb.group({
    nombre: ['', Validators.required],
    raza: [null, Validators.required],
    edad: [null, Validators.required],
    peso: ['', Validators.required],
    tamano: ['', Validators.required]
  });

  step = 0;

  constructor(
    private fb: FormBuilder, 
    private mascotaService: MascotaService,
    private snackbar: MatSnackBar,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.checkIfMobile();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (
      this.isMenuOpen &&
      !target.closest('.menu-lateral') &&
      !target.closest('.btn-open-menu')
    ) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 600;
  }

  nextStep() {
    if (this.step < 4) this.step++;
  }

  prevStep() {
    if (this.step > 0) this.step--;
  }

  onSubmit() {
    if (!this.mascotaForm.valid) {
      this.snackbar.open('Por favor registra a la mascota', 'Cerrar', { duration: 3000 });
      this.logger.warn('Formulario invalido al registrar mascota', this.mascotaForm.value);
      this.mascotaForm.markAllAsTouched();
      return;
    }
      this.mascotaService.registrarMascota(this.mascotaForm.value).subscribe({
        next: res => {
          this.snackbar.open('Mascota registrada exitosmente', 'Cerrar', { duration: 3000 });
          this.logger.info('Mascota registrada', this.mascotaForm.value);
          this.router.navigate(['/menu']);
        },
        error: err => {
          const mensaje = err.error?.message || 'Error en el registro';
          this.snackbar.open(mensaje, 'Cerrar', { duration: 3000 });
          this.logger.error('Error al registrar mascota', err);
        }
      });
  }

  getStepIcon(index: number): string {
    const icons = ['pets', 'assignment_ind', 'calendar_today', 'fitness_center', 'straighten'];
    return icons[index] || 'info';
  }
}
