import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  isMenuOpen: boolean = false;

  constructor() {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
