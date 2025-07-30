import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() sidebarOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser: any = null;
  pageTitle = 'Portal de Microservicios';

  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Usuario por defecto
    if (!this.currentUser) {
      this.currentUser = {
        id: '1',
        name: 'Admin Dev',
        email: 'admin@empresa.com',
        role: 'Administrador'
      };
    }

    // Suscribirse al usuario actual si hay servicio de auth
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.currentUser = user;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.authService.logout();
    console.log('Cerrando sesión...');
  }
}

// Exportación por defecto para asegurar compatibilidad
export default HeaderComponent;