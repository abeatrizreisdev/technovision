// src/app/cadastrar-item/cadastrar-item.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../services/item.service'; // <-- Importe o ItemService

@Component({
  selector: 'app-cadastrar-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './cadastrar-item.component.html',
  styleUrl: './cadastrar-item.component.css'
})
export class CadastrarItemComponent {

  itemName: string = '';
  itemDescription: string = '';
  itemPrice: number | null = null;
  itemQuantity: number | null = null;
  itemCategory: string = '';
  selectedFile: File | null = null;

  categories: string[] = [
    'Eletrônicos', 'Roupas', 'Livros', 'Decoração', 'Alimentos', 'Esportes', 'Brinquedos', 'Outros'
  ];

  // Injete o ItemService no construtor
  constructor(private itemService: ItemService) { }

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
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Preço, Quantidade, Categoria).');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.itemName); // Nomes dos campos do formulário
    formData.append('description', this.itemDescription);
    formData.append('price', this.itemPrice.toString());
    formData.append('quantity', this.itemQuantity.toString());
    formData.append('category', this.itemCategory);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    try {
      // Chama o método createItem do ItemService
      const result = await this.itemService.createItem(formData);
      console.log('Item cadastrado com sucesso no banco de dados MySQL!', result);
      alert('Item cadastrado com sucesso!');
      // Opcional: Redirecionar o usuário ou limpar o formulário
    } catch (error: any) {
      console.error('Erro ao cadastrar item:', error.message);
      alert(`Erro ao cadastrar item: ${error.message}`);
    }

    // Limpa os campos do formulário
    this.itemName = '';
    this.itemDescription = '';
    this.itemPrice = null;
    this.itemQuantity = null;
    this.itemCategory = '';
    this.selectedFile = null;
  }
}
