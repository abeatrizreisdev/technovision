// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeAccountComponent } from './home-account/home-account.component';
import { BannerCarrosselComponent } from './banner-carrossel/banner-carrossel.component';
import { CadastrarItemComponent } from './cadastrar-item/cadastrar-item.component'; // <-- ESSENCIAL: Importe o componente de cadastro
import { CatalogoComponent } from './catalogo/catalogo.component'; 

export const routes: Routes = [
  // Rota padrão (página inicial) - exibirá o BannerCarrosselComponent
  { path: '', component: BannerCarrosselComponent },

  // Rota para a página 'Minha Conta' - exibirá o HomeAccountComponent
  { path: 'minha-conta', component: HomeAccountComponent },

  // Rota para a página 'Cadastrar Item' - exibirá o CadastrarItemComponent
  { path: 'cadastrar-item', component: CadastrarItemComponent }, 

  { path: 'catalogo', component: CatalogoComponent }, 

];
