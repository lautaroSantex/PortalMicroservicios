import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  activeRoute = '';

  menuItems: MenuItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: 'bar-chart', 
      route: '/dashboard' 
    },
    { 
      id: 'grafana', 
      label: 'Grafana (Monitoreo)', 
      icon: 'trending-up', 
      route: '/grafana' 
    },
    { 
      id: 'consul', 
      label: 'Consul (Service Discovery)', 
      icon: 'server', 
      route: '/consul' 
    },
    { 
      id: 'vault', 
      label: 'Vault (Secretos)', 
      icon: 'shield', 
      route: '/vault' 
    },
    { 
      id: 'services', 
      label: 'Microservicios', 
      icon: 'database', 
      route: '/services' 
    },
    { 
      id: 'users', 
      label: 'Usuarios', 
      icon: 'users', 
      route: '/users' 
    },
    { 
      id: 'settings', 
      label: 'Configuración', 
      icon: 'settings', 
      route: '/settings' 
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Obtener ruta activa
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.urlAfterRedirects;
      });

    // Establecer ruta inicial
    this.activeRoute = this.router.url;
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }
}