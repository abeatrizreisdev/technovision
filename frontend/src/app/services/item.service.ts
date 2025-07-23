// src/app/services/item.service.ts

import { Injectable } from '@angular/core';

export interface Item {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private backendBaseUrl = 'http://localhost:3000/items';
  private backendStaticUrl = 'http://localhost:3000';

  constructor() { }

  async createItem(formData: FormData): Promise<any> {
    try {
      const response = await fetch(this.backendBaseUrl, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro de rede ou no servidor ao cadastrar item:', error);
      throw new Error('Não foi possível conectar ao servidor backend. Verifique se ele está rodando e se o CORS está configurado.');
    }
  }

  /**
   * Busca todos os itens do backend e filtra por um termo de busca ou categoria.
   * @param filterOptions Objeto com searchTerm (string) e/ou category (string) para filtrar.
   * @returns Uma Promise que resolve com um array de itens filtrados.
   */
  async getItems(filterOptions?: { searchTerm?: string; category?: string }): Promise<Item[]> {
    console.log('ItemService: getItems() chamado com opções de filtro:', filterOptions); // LOG
    try {
      const response = await fetch(this.backendBaseUrl, {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        let items: Item[] = data.map((itemData: any) => ({
          id: itemData.id,
          name: itemData.nome,
          description: itemData.descricao,
          price: itemData.preco,
          quantity: itemData.quantidade,
          category: itemData.categoria,
          imageUrl: itemData.image_url ? `${this.backendStaticUrl}${itemData.image_url}` : undefined,
        })) as Item[];

        // Aplica a filtragem no frontend
        if (filterOptions?.searchTerm) {
          const lowerCaseSearchTerm = filterOptions.searchTerm.toLowerCase();
          items = items.filter(item =>
            item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.category.toLowerCase().includes(lowerCaseSearchTerm)
          );
          console.log('ItemService: Itens filtrados por termo de busca. Total:', items.length); // LOG
        } else if (filterOptions?.category) {
          const lowerCaseCategory = filterOptions.category.toLowerCase();
          items = items.filter(item =>
            item.category.toLowerCase() === lowerCaseCategory
          );
          console.log('ItemService: Itens filtrados por categoria. Total:', items.length); // LOG
        } else {
          console.log('ItemService: Buscando todos os itens (sem filtro). Total:', items.length); // LOG
        }
        return items;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro de rede ou no servidor ao buscar itens:', error);
      throw new Error('Não foi possível conectar ao servidor backend. Verifique se ele está rodando e se o CORS está configurado.');
    }
  }

  async updateItem(id: number, formData: FormData): Promise<any> {
    try {
      const response = await fetch(`${this.backendBaseUrl}/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Erro de rede ou no servidor ao atualizar item ${id}:`, error);
      throw new Error('Não foi possível conectar ao servidor backend para atualizar o item.');
    }
  }

  async deleteItem(id: number): Promise<any> {
    try {
      const response = await fetch(`${this.backendBaseUrl}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Erro de rede ou no servidor ao excluir item ${id}:`, error);
      throw new Error('Não foi possível conectar ao servidor backend para excluir o item.');
    }
  }
}
