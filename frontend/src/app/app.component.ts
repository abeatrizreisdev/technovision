import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BannerCarrosselComponent } from './banner-carrossel/banner-carrossel.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, BannerCarrosselComponent],
  template: `
  <app-header></app-header>
  <main>
    <router-outlet></router-outlet>
    <app-banner-carrossel></app-banner-carrossel>
  </main>
  <app-footer></app-footer>
`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'technovision';
}