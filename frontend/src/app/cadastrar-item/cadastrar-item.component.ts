// src/app/cadastrar-item/cadastrar-item.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-item',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterLink,
    FormsModule
  ],
  templateUrl: './cadastrar-item.component.html',
  styleUrl: './cadastrar-item.component.css' // <-- VERIFIQUE SE ESTE CAMINHO ESTÁ CORRETO
})
export class CadastrarItemComponent {

  itemName: string = '';
  itemDescription: string = '';
  itemPrice: number | null = null;
  itemQuantity: number | null = null;
  itemCategory: string = '';
  selectedFile: File | null = null;

  categories: string[] = [
    'Eletrônicos',
    'Roupas',
    'Livros',
    'Decoração',
    'Alimentos',
    'Esportes',
    'Brinquedos',
    'Outros'
  ];

  constructor() { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Arquivo selecionado:', this.selectedFile.name, 'Tamanho:', this.selectedFile.size, 'Tipo:', this.selectedFile.type);
    } else {
      this.selectedFile = null;
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.itemName || !this.itemPrice || !this.itemQuantity || !this.itemCategory) {
      console.error('Por favor, preencha todos os campos obrigatórios (Nome, Preço, Quantidade, Categoria).');
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.itemName);
    formData.append('description', this.itemDescription);
    formData.append('price', this.itemPrice.toString());
    formData.append('quantity', this.itemQuantity.toString());
    formData.append('category', this.itemCategory);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    const backendUrl = 'http://localhost:3000/items';

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Item cadastrado com sucesso!', result);
        alert('Item cadastrado com sucesso!');
      } else {
        const errorData = await response.json();
        console.error('Erro ao cadastrar item:', response.status, errorData);
        alert(`Erro ao cadastrar item: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Erro de rede ou no servidor:', error);
      alert('Não foi possível conectar ao servidor backend. Verifique se ele está rodando e se o CORS está configurado.');
    }

    this.itemName = '';
    this.itemDescription = '';
    this.itemPrice = null;
    this.itemQuantity = null;
    this.itemCategory = '';
    this.selectedFile = null;
  }
}
