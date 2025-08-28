import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 overflow-hidden relative">
      <!-- Elementos decorativos de fondo -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-300/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Header con logo -->
      <header class="relative z-10 w-full px-8 py-6">
        <div class="max-w-7xl mx-auto flex items-center">
          <div class="flex items-center space-x-3">
            <!-- Logo BPN - Puedes cambiar la ruta aquí -->
            <img 
              [src]="logoPath" 
              alt="BPN Logo" 
              class="h-12 w-auto object-contain"
              (error)="onLogoError($event)"
            />
            <!-- Fallback si no se carga la imagen -->
            <span *ngIf="!logoLoaded" class="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              BPN
            </span>
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div class="max-w-4xl mx-auto text-center">


          <!-- Título principal con animación -->
          <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            <span class="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Bienvenido al Portal de
            </span>
            <br />
            <span class="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
              Microservicios BPN
            </span>
          </h1>

          <!-- Descripción -->
          <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Centraliza y gestiona los aplicativos digitales del banco en un solo lugar. 
            Acceso seguro, rápido y eficiente.
          </p>

          <!-- Features cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up animation-delay-400">
            <div class="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200 hover:-translate-y-1">
              <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-800 mb-2">Acceso Seguro</h3>
              <p class="text-sm text-gray-600"> Vault para gestión centralizada de credenciales, tokens y certificados</p>
            </div>

            <div class="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-800 mb-2">Servicios Centralizados</h3>
              <p class="text-sm text-gray-600">Todos los microservicios del banco en un único portal integrado</p>
            </div>

            <div class="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200 hover:-translate-y-1">
              <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-800 mb-2">Monitoreo en Tiempo Real</h3>
              <p class="text-sm text-gray-600">Grafana dashboards con métricas, logs y trazas de todos los microservicios</p>
            </div>
          </div>

          <!-- Botón de login -->
          <div class="animate-fade-in-up animation-delay-600">
            <button 
              (click)="login()"
              class="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <span class="relative z-10 flex items-center">
                Iniciar Sesión
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <p class="text-sm text-gray-500 mt-4">
              Utiliza tus credenciales corporativas para acceder
            </p>
          </div>
        </div>

        <!-- Indicador de scroll (opcional) -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-10 w-full px-8 py-4 mt-auto">
        <div class="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <span>© 2024 Banco Provincia del Neuquén</span>
          <div class="flex items-center space-x-4">
            <span>Portal Empresarial v{{version}}</span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes gradient {
      0%, 100% {
        background-size: 200% 200%;
        background-position: left center;
      }
      50% {
        background-size: 200% 200%;
        background-position: right center;
      }
    }

    .animate-fade-in-up {
      animation: fade-in-up 0.6s ease-out forwards;
    }

    .animation-delay-200 {
      animation-delay: 200ms;
    }

    .animation-delay-400 {
      animation-delay: 400ms;
    }

    .animation-delay-600 {
      animation-delay: 600ms;
    }

    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient 3s ease-in-out infinite;
    }
  `]
})
export class WelcomeComponent implements OnInit {
  private authService = inject(AuthService);
  version = '1.0.0'; // Puedes obtener esto de un servicio de configuración
  
  // Configuración del logo - CAMBIA ESTA RUTA A LA UBICACIÓN DE TU LOGO
  logoPath = 'assets/images/logo_sin_claim_horizontal_2-removebg-preview.png'; 
  logoLoaded = true;

  ngOnInit(): void {
    // Puedes agregar lógica de inicialización aquí si es necesario
  }

  login(): void {
    this.authService.login();
  }

  onLogoError(event: any): void {
    // Si la imagen no se carga, muestra el texto fallback
    this.logoLoaded = false;
    console.warn('No se pudo cargar el logo desde:', this.logoPath);
  }
}