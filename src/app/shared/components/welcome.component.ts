import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align: center; padding: 50px;">
      <h1>Bienvenido al Portal</h1>
      <p>Para acceder al contenido, por favor inicia sesión.</p>
      <button (click)="login()">Iniciar Sesión</button>
    </div>
  `
})
export class WelcomeComponent {
  private authService = inject(AuthService);

  login(): void {
    this.authService.login();
  }
}