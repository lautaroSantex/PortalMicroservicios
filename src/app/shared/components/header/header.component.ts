import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

// Importar el AuthService y GroupAD (descomenta cuando tengas el import correcto)
// import { AuthService, GroupAD } from '../../services/auth.service';

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
  @Input() bankName = 'BANCO PATAGONIA';
  @Input() logoPath = 'assets/images/logo_sin_claim_horizontal_2-removebg-preview.png';
  
  @Output() logout = new EventEmitter<void>();

  currentUser: User | null = null;
  
  private router = inject(Router);
  // Hacer AuthService opcional - descomenta cuando tengas el import
  private authService = inject(AuthService, { optional: true });
  //private authService: any = null; // Temporal
  private subscriptions = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.initializeUser();
    this.setupAuthEffects();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setupAuthEffects(): void {
    // Solo configurar effects si AuthService está disponible
    if (this.authService) {
      // Effect para el perfil del usuario
      effect(() => {
        const auth = this.authService;
        if (!auth) return;
        const profile = auth.userProfile();
        if (profile) {
          this.updateUserFromProfile(profile);
        }
      });

      // Effect para los roles del usuario
      effect(() => {
        const auth = this.authService;
        if (!auth) return;
        const roles = auth.userRoles();
        if (this.currentUser && roles.length > 0) {
          this.currentUser = {
            ...this.currentUser,
            role: roles[0]?.name || 'Usuario'
          };
        }
      });
    }
  }

  private initializeUser(): void {
    if (this.authService) {
      // Para signals, accedemos directamente al valor actual
      const profile = this.authService.userProfile();
      const roles = this.authService.userRoles();
      
      if (profile) {
        this.updateUserFromProfile(profile);
        
        // Si hay roles disponibles, usar el primero
        if (roles.length > 0) {
          this.currentUser = {
            ...this.currentUser!,
            role: roles[0]?.name || 'Usuario'
          };
        }
      }
    } else {
      // Fallback para desarrollo sin AuthService
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

  private updateUserFromProfile(profile: any): void {
    this.currentUser = {
      id: profile.userId || profile.sub || 'USR001',
      name: profile.family_name || profile.name || 'Usuario',
      email: profile.email || '',
      role: this.currentUser?.role || 'Usuario',
      department: 'Tecnología',
      lastLogin: new Date()
    };
  }

  onLogout(): void {
    // Usar AuthService si está disponible, sino lógica por defecto
    if (this.authService) {
      this.authService.logout();
    } else {
      this.clearUserSession();
    }
    
    // Emitir evento de logout
    this.logout.emit();
    
    // Redirigir a welcome si no hay listener externo
    if (this.logout.observed === false) {
      this.router.navigate(['/welcome']);
    }
  }

  private clearUserSession(): void {
    try {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-preferences');
      localStorage.removeItem('session-data');
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