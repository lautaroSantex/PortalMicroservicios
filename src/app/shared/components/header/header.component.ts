import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  lastLogin?: Date;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() pageTitle = 'Portal de Microservicios';
  @Input() bankName = 'BANCO PATAGONIA'; // Nombre del banco configurable
  @Input() logoPath = 'assets/images/logo_sin_claim_horizontal_2-removebg-preview.png'; // Ruta del logo configurable
  
  @Output() logout = new EventEmitter<void>();

  currentUser: User | null = null;
  
  private router = inject(Router);
  private subscriptions = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.initializeUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeUser(): void {
    // En un escenario real, esto vendría de un servicio de autenticación
    if (!this.currentUser) {
      this.currentUser = {
        id: 'USR001',
        name: 'Luis Ruiz',
        email: 'luis.ruiz@banco.com',
        role: 'Arquitecto de Soluciones',
        department: 'Tecnología',
        lastLogin: new Date()
      };
    }
  }

  onLogout(): void {
    // Limpiar datos de sesión
    this.clearUserSession();
    
    // Emitir evento de logout
    this.logout.emit();
    
    // Redirigir a welcome si no hay listener externo
    if (this.logout.observed === false) {
      this.router.navigate(['/welcome']);
    }
  }

  private clearUserSession(): void {
    try {
      // Limpiar localStorage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-preferences');
      localStorage.removeItem('session-data');
      
      // Limpiar sessionStorage si es necesario
      sessionStorage.clear();
      
      console.log('Sesión limpiada correctamente');
    } catch (error) {
      console.error('Error al limpiar la sesión:', error);
    }
  }

  // Método para obtener las iniciales del usuario (para móvil)
  getUserInitials(): string {
    if (!this.currentUser?.name) return 'U';
    
    return this.currentUser.name
      .split(' ')
      .map(name => name.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // Método para manejar error de carga de imagen
  onImageError(event: any): void {
    const img = event.target;
    const fallback = img.nextElementSibling;
    
    if (img && fallback) {
      img.style.display = 'none';
      fallback.style.display = 'flex';
    }
  }
}

// Exportación por defecto para mantener compatibilidad
export default HeaderComponent;