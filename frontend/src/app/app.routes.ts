// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeAccountComponent } from './home-account/home-account.component';
import { BannerCarrosselComponent } from './banner-carrossel/banner-carrossel.component';
import { CadastrarItemComponent } from './cadastrar-item/cadastrar-item.component'; // <-- ESSENCIAL: Importe o componente de cadastro
import { CatalogoComponent } from './catalogo/catalogo.component';
import { EditarItemComponent } from './editar-item/editar-item.component'; // <-- Importe o EditarItemComponent
import { VisualizacaoItensComponent } from './visualizacao-itens/visualizacao-itens.component'; // <-- Importe o novo componente
import { ArduinoComponent } from './arduino/arduino.component';
import { KitsDiversosComponent } from './kits-diversos/kits-diversos.component';
import { ComponentesComponent } from './componentes/componentes.component';


export const routes: Routes = [
  // Rota padrão (página inicial) - exibirá o BannerCarrosselComponent
  { path: '', component: BannerCarrosselComponent },

  // Rota para a página 'Minha Conta' - exibirá o HomeAccountComponent
  { path: 'minha-conta', component: HomeAccountComponent },

  // Rota para a página 'Cadastrar Item' - exibirá o CadastrarItemComponent
  { path: 'cadastrar-item', component: CadastrarItemComponent },

  { path: 'catalogo', component: CatalogoComponent },

  { path: 'editar-item/:id', component: EditarItemComponent }, // <-- Adicione esta nova rota com parâmetro ID

  { path: 'visualizacao-itens', component: VisualizacaoItensComponent }, // <-- Nova rota para visualização
  
  { path: 'arduino', component: ArduinoComponent },

  { path: 'kits-diversos', component: KitsDiversosComponent },

  { path: 'componentes', component: ComponentesComponent },
];
