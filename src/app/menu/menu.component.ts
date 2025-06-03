import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  isMenuOpen = false;

  constructor() {}

  openMenu() {
    this.isMenuOpen = true;
    console.log("Click");
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
