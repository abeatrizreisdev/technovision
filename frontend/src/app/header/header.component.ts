// src/app/header/header.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchQuery: string = '';
  isMenuOpen: boolean = false;

  constructor(private router: Router) { }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // A busca geral ainda leva para visualizacao-itens com o termo de busca
      this.router.navigate(['/visualizacao-itens'], { queryParams: { search: this.searchQuery.trim() } });
    } else {
      this.router.navigate(['/visualizacao-itens']);
    }
  }

  /**
   * Lida com a navegação para links de categoria do menu.
   * Redireciona para as PÁGINAS DEDICADAS de cada categoria.
   * @param target O nome da categoria (que será usado como parte da rota).
   */
  navigateTo(target: string): void {
    this.isMenuOpen = false; // Fecha o menu mobile após a navegação

    switch (target) {
      case 'Arduino':
        this.router.navigate(['/arduino']); // Redireciona para o componente ArduinoComponent
        break;
      case 'Kits Diversos':
        this.router.navigate(['/kits-diversos']); // Redireciona para o componente KitsDiversosComponent
        break;
      case 'Componentes':
        this.router.navigate(['/componentes']); // Redireciona para o componente ComponentesComponent
        break;
      // Adicione outros casos para links que não são categorias, se for usá-los
      default:
        console.warn('Navegação de menu não reconhecida ou não implementada:', target);
        this.router.navigate(['/']); // Volta para a página inicial como fallback
        break;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
