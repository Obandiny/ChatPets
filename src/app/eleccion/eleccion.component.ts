import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-eleccion',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './eleccion.component.html',
  styleUrls: ['./eleccion.component.css']
})
export class EleccionComponent {

}
