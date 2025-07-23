// src/app/visualizacao-itens/visualizacao-itens.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItemService, Item } from '../services/item.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-visualizacao-itens',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './visualizacao-itens.component.html',
  styleUrl: './visualizacao-itens.component.css'
})
export class VisualizacaoItensComponent implements OnInit, OnDestroy {

  items: Item[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  currentSearchTerm: string = '';
  // Removido: currentCategory: string = ''; // Não precisamos mais de categoria aqui
  private queryParamsSubscription: Subscription | undefined;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.currentSearchTerm = params['search'] || '';
      // Removido: this.currentCategory = params['category'] || '';
      this.fetchItems();
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  /**
   * Busca os itens do backend usando o ItemService, filtrando apenas por termo de busca.
   */
  async fetchItems(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.items = [];

    try {
      // Passa apenas o searchTerm para o ItemService.
      // A filtragem por categoria será feita em componentes dedicados.
      this.items = await this.itemService.getItems({ searchTerm: this.currentSearchTerm });

    } catch (error: any) {
      console.error('Erro ao buscar itens:', error.message);
      this.errorMessage = `Erro ao carregar os itens: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  buyItem(item: Item): void {
    alert(`Item "${item.name}" adicionado ao carrinho! (Simulação)`);
  }
}
