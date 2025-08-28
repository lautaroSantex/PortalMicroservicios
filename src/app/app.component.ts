// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent
  ],
  template: `
    <!-- Layout con Header (para rutas protegidas) -->
    <div *ngIf="showLayout" class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header mejorado -->
<app-header 
  [pageTitle]="'Portal de Microservicios'"
  [logoPath]="'assets/imagenes/logo_sin_claim_horizontal_2-removebg-preview.png'"
  (logout)="handleLogout()">
</app-header>

      <!-- Page Content -->
      <main class="flex-1 fade-in">
        <router-outlet></router-outlet>
      </main>
    </div>

    <!-- Layout simple (para welcome y otras rutas públicas) -->
    <div *ngIf="!showLayout" class="min-h-screen">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  showLayout = true;
  currentPageTitle = 'Portal de Microservicios';
  currentSubtitle = 'Gestión de Infraestructura Digital';
  environment: 'DEV' | 'TEST' | 'PROD' = 'PROD';
  
  private destroy$ = new Subject<void>();

  // Rutas que NO deben mostrar el layout con header
  private routesWithoutLayout = ['/welcome', '/login'];

  constructor(private router: Router) {}

  ngOnInit() {
    // Escuchar cambios de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.updateLayoutVisibility(event.url);
      this.updatePageInfo(event.url);
    });

    // Configuración inicial
    this.updateLayoutVisibility(this.router.url);
    this.updatePageInfo(this.router.url);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateLayoutVisibility(url: string): void {
    this.showLayout = !this.routesWithoutLayout.some(route => 
      url.startsWith(route)
    );
  }

  private updatePageInfo(url: string): void {
    // Mapeo de títulos por ruta
    const routeInfo: { [key: string]: { title: string; subtitle: string } } = {
      '/projects': {
        title: 'Selector de Proyectos',
        subtitle: 'Elige tu proyecto de trabajo'
      },
      '/project': {
        title: 'Dashboard del Proyecto',
        subtitle: 'Gestión de Microservicios'
      }
    };

    // Buscar coincidencia de ruta
    const matchedRoute = Object.keys(routeInfo).find(route => 
      url.startsWith(route)
    );

    if (matchedRoute) {
      const info = routeInfo[matchedRoute];
      this.currentPageTitle = info.title;
      this.currentSubtitle = info.subtitle;
    } else {
      // Valores por defecto
      this.currentPageTitle = 'Portal de Microservicios';
      this.currentSubtitle = 'Gestión de Infraestructura Digital';
    }
  }

  handleLogout(): void {
    // Limpiar sesión
    localStorage.removeItem('auth-token');
    sessionStorage.clear();
    
    // Redirigir a welcome
    this.router.navigate(['/welcome']);
  }

  showNotifications(): void {
    // Implementar panel de notificaciones
    console.log('Mostrando notificaciones...');
  }
}