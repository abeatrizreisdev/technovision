import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchQuery = '';
  isMenuOpen = false;

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Pesquisando por:', this.searchQuery);
      // Implementar lógica de pesquisa aqui
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(route: string) {
    console.log('Navegando para:', route);
    // Implementar navegação aqui
  }
}