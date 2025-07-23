// src/app/kits-diversos/kits-diversos.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { ItemService, Item } from '../services/item.service'; // Importe ItemService e Item

@Component({
  selector: 'app-kits-diversos',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './kits-diversos.component.html',
  styleUrl: './kits-diversos.component.css'
})
export class KitsDiversosComponent implements OnInit {

  items: Item[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  fixedCategory: string = 'Kits Diversos'; // <--- CATEGORIA FIXA PARA KITS DIVERSOS

  constructor(private itemService: ItemService) { }

  async ngOnInit(): Promise<void> {
    await this.fetchItems();
  }

  /**
   * Busca os itens do backend, filtrando pela categoria fixa 'Kits Diversos'.
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
