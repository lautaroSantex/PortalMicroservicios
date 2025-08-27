import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-4">Portal de Microservicios</h1>
      <p class="text-lg text-gray-600 mb-8">Por favor, inicia sesión para continuar.</p>
      <button 
        (click)="login()"
        class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
        Iniciar Sesión con OpenID
      </button>
    </div>
  `
})
export class WelcomeComponent {
  private authService = inject(AuthService);

  login(): void {
    this.authService.login();
  }
}