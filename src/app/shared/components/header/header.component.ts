import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

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
  ) { }

  ngOnInit(): void {
    // Usuario por defecto
    if (!this.currentUser) {
      this.currentUser = {
        id: '1',
        name: 'Ruizla',
        email: 'admin@empresa.com',
        role: 'Operador',
      };
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }


}

// Exportación por defecto para asegurar compatibilidad
export default HeaderComponent;