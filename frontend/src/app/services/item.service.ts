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
  // URL base para servir imagens estáticas do backend
  private backendStaticUrl = 'http://localhost:3000'; // <--- Adicionado

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
          // Se itemData.image_url for '/uploads/nome.jpg', se torna 'http://localhost:3000/uploads/nome.jpg'
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

  async updateItem(id: number, item: Partial<Item>): Promise<any> {
    try {
      const response = await fetch(`${this.backendBaseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
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
