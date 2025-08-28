import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';

  
@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <a routerLink="/projects" 
               class="text-gray-700 hover:text-blue-600 inline-flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Proyectos
            </a>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
              </svg>
              <span class="ml-1 text-gray-700 font-medium flex items-center">
                <span class="mr-2">{{ currentProject?.icon }}</span>
                {{ currentProject?.name }}
              </span>
            </div>
          </li>
          <li *ngIf="currentRoute !== 'tools'">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
              </svg>
              <span class="ml-1 text-gray-700">{{ getCurrentToolName() }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Project Info Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
              {{ currentProject?.icon }}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ currentProject?.name }}</h1>
              <p class="text-gray-600">{{ currentProject?.description }}</p>
            </div>
          </div>
          <button 
            (click)="changeProject()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Cambiar Proyecto
          </button>
        </div>
      </div>
      
      <!-- Tools Section Title -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Herramientas Disponibles
        </h2>
      </div>

      <!-- Router Outlet for Child Components -->
      <router-outlet></router-outlet>

      <!-- Floating Action Button -->
      <div class="fixed bottom-8 right-8">
        <button 
          (click)="toggleQuickMenu()"
          class="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg 
                 hover:bg-blue-700 transition-all duration-200 hover:shadow-xl
                 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>

        <!-- Quick Menu -->
        <div *ngIf="showQuickMenu" 
             class="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 min-w-[200px] z-50">
          <button 
            *ngFor="let tool of availableTools"
            (click)="quickNavigate(tool.route)"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors
                   flex items-center space-x-3">
            <span>{{ tool.icon }}</span>
            <span>{{ tool.name }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes slideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    router-outlet + * {
      animation: slideIn 0.3s ease-out;
    }
  `]
})
export class ProjectDashboardComponent implements OnInit, OnDestroy {
  currentProject: Project | null = null;
  currentRoute: string = 'tools';
  showQuickMenu: boolean = false;
  private destroy$ = new Subject<void>();

  // TABS COMENTADOS - Descomentar cuando se necesiten
  /*
  tabs = [
    { name: 'Herramientas', route: 'tools', icon: '🔧' },
    { name: 'Métricas', route: 'metrics', icon: '📊', badge: 'New' },
    { name: 'Logs', route: 'logs', icon: '📝' },
    { name: 'Configuración', route: 'settings', icon: '⚙️' }
  ];
  */

  // Por ahora solo mantenemos el tab de herramientas
  tabs = [
    { name: 'Herramientas', route: 'tools', icon: '🔧' }
  ];
/* 
  quickActions = [
    { name: 'Grafana', route: 'grafana', icon: '📊' },
    { name: 'Consul', route: 'consul', icon: '🔍' },
    { name: 'Vault', route: 'vault', icon: '🔒' }
  ];
 */
  availableTools: any[] = [];
  authService: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // Obtener el proyecto desde la ruta
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const projectId = params['projectId'];
        this.loadProject(projectId);
      });

    // Escuchar cambios en la ruta hija
    this.route.firstChild?.url
      .pipe(takeUntil(this.destroy$))
      .subscribe(urlSegments => {
        if (urlSegments.length > 0) {
          this.currentRoute = urlSegments[0].path;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private loadProject(projectId: string): void {
    // getProjectById ahora es seguro y solo devolverá el proyecto si tenemos acceso.
    this.currentProject = this.projectService.getProjectById(projectId);
    
    if (!this.currentProject) {
      console.error(`Acceso denegado o proyecto no encontrado: ${projectId}`);
      this.router.navigate(['/projects']); // Lo enviamos de vuelta al selector.
      return;
    }

    // --- ¡FILTRADO DE HERRAMIENTAS ACTIVADO! ---
    this.availableTools = Object.entries(this.currentProject.tools)
      .map(([key, tool]: [string, any]) => ({
        key: key,
        route: this.getToolRoute(key),
        name: tool.name,
        icon: this.getToolIcon(key),
        requiredGroup: tool.requiredGroup // Leemos el grupo requerido de la herramienta
      }))
      .filter(tool => {
        // Misma lógica: si no requiere grupo, se muestra. Si lo requiere, se valida.
        if (!tool.requiredGroup) {
          return true;
        }
        return this.authService.hasRole(tool.requiredGroup);
      });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  changeProject(): void {
    this.router.navigate(['/projects']);
  }

  navigateToTool(route: string): void {
    this.router.navigate([route], { relativeTo: this.route });
  }

  navigateToTab(route: string): void {
    // Por ahora solo 'tools' está implementado
    if (route === 'tools') {
      this.router.navigate(['tools'], { relativeTo: this.route });
    } else {
      console.log(`Tab ${route} no implementado aún`);
    }
  }

  isActiveTab(route: string): boolean {
    return this.currentRoute === route;
  }

  getCurrentToolName(): string {
    const toolMap: { [key: string]: string } = {
      'grafana': 'Grafana',
      'consul': 'Consul',
      'vault': 'Vault',
      'health-check': 'Health Check',
      'kubernetes': 'Kubernetes',
      'portal': 'Portal'
    };
    return toolMap[this.currentRoute] || this.currentRoute;
  }

  toggleQuickMenu(): void {
    this.showQuickMenu = !this.showQuickMenu;
  }

  quickNavigate(route: string): void {
    this.showQuickMenu = false;
    this.navigateToTool(route);
  }

  private getToolRoute(toolKey: string): string {
    const routeMap: { [key: string]: string } = {
      'grafana': 'grafana',
      'consul': 'consul',
      'vault': 'vault',
      'healthCheck': 'health-check',
      'kubernetes': 'kubernetes',
      'portalLink': 'portal'
    };
    return routeMap[toolKey] || toolKey;
  }

  private getToolIcon(toolKey: string): string {
    const iconMap: { [key: string]: string } = {
      'grafana': '📊',
      'consul': '🔍',
      'vault': '🔒',
      'healthCheck': '💚',
      'kubernetes': '☸️',
      'portalLink': '📈'
    };
    return iconMap[toolKey] || '🔧';
  }
}