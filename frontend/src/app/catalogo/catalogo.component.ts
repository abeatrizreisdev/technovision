// src/app/catalogo/catalogo.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importe Router
import { ItemService, Item } from '../services/item.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {

  items: Item[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private itemService: ItemService, private router: Router) { } // Injete Router

  async ngOnInit(): Promise<void> {
    await this.fetchItems();
  }

  async fetchItems(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.items = [];

    try {
      this.items = await this.itemService.getItems();
      console.log('Itens carregados:', this.items);
    } catch (error: any) {
      console.error('Erro ao buscar itens:', error.message);
      this.errorMessage = `Erro ao carregar os itens do catálogo: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Lida com a ação de editar um item, navegando para a página de edição.
   * @param item O item a ser editado.
   */
  editItem(item: Item): void {
    if (item.id !== undefined) {
      this.router.navigate(['/editar-item', item.id]); // Navega para a rota de edição com o ID
    } else {
      alert('Erro: ID do item não definido para edição.');
    }
  }

  /**
   * Lida com a ação de excluir um item.
   * @param id O ID do item a ser excluído.
   */
  async deleteItem(id: number | undefined): Promise<void> {
    if (id === undefined) {
      alert('Erro: ID do item não definido para exclusão.');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o item com ID: ${id}?`)) {
      try {
        await this.itemService.deleteItem(id);
        alert('Item excluído com sucesso!');
        await this.fetchItems(); // Recarrega a lista de itens após a exclusão
      } catch (error: any) {
        console.error('Erro ao excluir item:', error.message);
        alert(`Erro ao excluir item: ${error.message}`);
      }
    }
  }
}
