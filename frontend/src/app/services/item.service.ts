// src/app/services/item.service.ts

import { Injectable } from '@angular/core';

export interface Item {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string; // Opcional, pois pode não ter imagem
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private backendBaseUrl = 'http://localhost:3000/items';
  private backendStaticUrl = 'http://localhost:3000'; // URL base para servir imagens estáticas

  constructor() { }

  /**
   * Envia os dados de um novo item para o backend para cadastro.
   * @param formData Um objeto FormData contendo os dados do item e o arquivo de imagem.
   * @returns Uma Promise que resolve com o resultado do backend ou rejeita com um erro.
   */
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
   * Busca todos os itens do backend.
   * @returns Uma Promise que resolve com um array de itens ou rejeita com um erro.
   */
  async getItems(): Promise<Item[]> {
    try {
      const response = await fetch(this.backendBaseUrl, {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        return data.map((itemData: any) => ({
          id: itemData.id,
          name: itemData.nome,
          description: itemData.descricao,
          price: itemData.preco,
          quantity: itemData.quantidade,
          category: itemData.categoria,
          // CONSTRUÇÃO DA URL COMPLETA DA IMAGEM AQUI:
          imageUrl: itemData.image_url ? `${this.backendStaticUrl}${itemData.image_url}` : undefined,
        })) as Item[];
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro de rede ou no servidor ao buscar itens:', error);
      throw new Error('Não foi possível conectar ao servidor backend. Verifique se ele está rodando e se o CORS está configurado.');
    }
  }

  /**
   * Atualiza um item existente no backend, incluindo a possibilidade de enviar uma nova imagem.
   * @param id O ID do item a ser atualizado.
   * @param formData Um objeto FormData contendo os dados atualizados do item e, opcionalmente, o novo arquivo de imagem.
   * @returns Uma Promise que resolve com o resultado do backend ou rejeita com um erro.
   */
  async updateItem(id: number, formData: FormData): Promise<any> { // <--- Aceita FormData agora
    try {
      const response = await fetch(`${this.backendBaseUrl}/${id}`, {
        method: 'PUT',
        body: formData // Envia FormData
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

  /**
   * Exclui um item do backend.
   * @param id O ID do item a ser excluído.
   * @returns Uma Promise que resolve com o resultado do backend ou rejeita com um erro.
   */
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
