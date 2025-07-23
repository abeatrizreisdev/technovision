// src/app/editar-item/editar-item.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemService, Item } from '../services/item.service';

@Component({
  selector: 'app-editar-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './editar-item.component.html',
  styleUrl: './editar-item.component.css'
})
export class EditarItemComponent implements OnInit {

  itemId: number | null = null;
  item: Item | null = null; // Objeto Item para preencher o formulário
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedFile: File | null = null; // Para a nova imagem selecionada

  categories: string[] = [
    'Eletrônicos', 'Roupas', 'Livros', 'Decoração', 'Alimentos', 'Esportes', 'Brinquedos', 'Outros'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      const idParam = params.get('id');
      if (idParam) {
        this.itemId = +idParam;
        await this.loadItem(this.itemId);
      } else {
        this.errorMessage = 'ID do item não fornecido na URL.';
        this.isLoading = false;
      }
    });
  }

  async loadItem(id: number): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const allItems = await this.itemService.getItems();
      this.item = allItems.find(i => i.id === id) || null;

      if (!this.item) {
        this.errorMessage = `Item com ID ${id} não encontrado.`;
        alert(this.errorMessage);
        this.router.navigate(['/catalogo']);
      }
    } catch (error: any) {
      console.error('Erro ao carregar item para edição:', error.message);
      this.errorMessage = `Erro ao carregar item: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Lida com a seleção de um novo arquivo de imagem.
   * Armazena o arquivo na propriedade 'selectedFile'.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Nova imagem selecionada:', this.selectedFile.name);
      // Opcional: Atualizar a prévia da imagem no formulário
      if (this.item) {
        this.item.imageUrl = URL.createObjectURL(this.selectedFile); // Cria uma URL temporária para prévia
      }
    } else {
      this.selectedFile = null;
    }
  }

  /**
   * Lida com o envio do formulário de edição.
   * Envia os dados atualizados e a nova imagem (se selecionada) para o backend.
   */
  async onSubmit(): Promise<void> {
    if (!this.item || !this.itemId) {
      alert('Erro: Item ou ID não definido para atualização.');
      return;
    }

    if (!this.item.name || !this.item.price || !this.item.quantity || !this.item.category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Constrói um FormData para enviar os dados, incluindo a imagem
    const formData = new FormData();
    formData.append('name', this.item.name);
    formData.append('description', this.item.description);
    formData.append('price', this.item.price.toString());
    formData.append('quantity', this.item.quantity.toString());
    formData.append('category', this.item.category);

    // Se uma NOVA imagem foi selecionada, adicione-a ao FormData
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    } else if (this.item.imageUrl) {
      // Se não há nova imagem, mas já existe uma URL, envie a URL antiga para o backend
      // O backend precisará saber que não é um novo arquivo, mas sim a URL existente
      // Uma forma é enviar a URL como um campo de texto.
      formData.append('imageUrl', this.item.imageUrl);
    }

    try {
      const result = await this.itemService.updateItem(this.itemId, formData);
      console.log('Item atualizado com sucesso!', result);
      alert('Item atualizado com sucesso!');
      this.router.navigate(['/catalogo']);
    } catch (error: any) {
      console.error('Erro ao atualizar item:', error.message);
      alert(`Erro ao atualizar item: ${error.message}`);
    }
  }

  goBack(): void {
    this.router.navigate(['/catalogo']);
  }
}
