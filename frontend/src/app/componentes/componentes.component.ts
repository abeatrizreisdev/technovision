// src/app/componentes/componentes.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { ItemService, Item } from '../services/item.service'; // Importe ItemService e Item

@Component({
  selector: 'app-componentes',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './componentes.component.html',
  styleUrl: './componentes.component.css'
})
export class ComponentesComponent implements OnInit {

  items: Item[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  fixedCategory: string = 'Componentes'; // <--- CATEGORIA FIXA PARA COMPONENTES

  constructor(private itemService: ItemService) { }

  async ngOnInit(): Promise<void> {
    await this.fetchItems();
  }

  /**
   * Busca os itens do backend, filtrando pela categoria fixa 'Componentes'.
   */
  async fetchItems(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.items = [];

    try {
      this.items = await this.itemService.getItems({ category: this.fixedCategory });
      console.log(`Itens da categoria '${this.fixedCategory}' carregados:`, this.items.length);
    } catch (error: any) {
      console.error(`Erro ao buscar itens da categoria '${this.fixedCategory}':`, error.message);
      this.errorMessage = `Erro ao carregar os itens da categoria '${this.fixedCategory}': ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  buyItem(item: Item): void {
    alert(`Item "${item.name}" adicionado ao carrinho! (Simulação)`);
  }
}
