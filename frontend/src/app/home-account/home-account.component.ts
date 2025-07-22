// src/app/home-account/home-account.component.ts

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // isPlatformBrowser também vem daqui
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home-account',
    standalone: true,
    imports: [
        CommonModule,
        HeaderComponent,
        FooterComponent,
        RouterLink
    ],
    templateUrl: './home-account.component.html',
    styleUrl: './home-account.component.css'
})
export class HomeAccountComponent {
}
