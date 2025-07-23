// src/app/catalogo/catalogo.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { ItemService, Item } from '../services/item.service'; // Importe ItemService e a interface Item

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

  items: Item[] = []; // Array para armazenar os itens do catálogo
  isLoading: boolean = true; // Indicador de carregamento
  errorMessage: string = ''; // Mensagem de erro

  // Injete o ItemService no construtor
  constructor(private itemService: ItemService) { }

  async ngOnInit(): Promise<void> {
    await this.fetchItems(); // Busca os itens ao iniciar o componente
  }

  /**
   * Busca os itens do backend usando o ItemService.
   */
  async fetchItems(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.items = []; // Limpa os itens existentes antes de buscar novamente

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
   * Lida com a ação de editar um item.
   * Por enquanto, apenas um console.log. Em um app real, redirecionaria para um formulário de edição.
   * @param item O item a ser editado.
   */
  editItem(item: Item): void {
    alert(`Funcionalidade de Edição para o item: ${item.name} (ID: ${item.id}) - Em breve!`);
    console.log('Editar item:', item);
    // Futuramente: this.router.navigate(['/editar-item', item.id]);
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

    if (confirm(`Tem certeza que deseja excluir o item com ID: ${id}?`)) { // Usando confirm para simplicidade
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
