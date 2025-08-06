import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Project, Tool } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { EnvironmentService } from '../../../services/environment.service';
import { Environment, EnvironmentConfig } from '../../../config/environment.config';

@Component({
  selector: 'app-tools-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fade-in">
      <!-- Environment Selector -->
      <div class="mb-6 bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">Entorno:</h3>
            <div class="flex space-x-2">
              <button 
                *ngFor="let env of environments"
                (click)="selectEnvironment(env.key)"
                [class]="currentEnvironment === env.key ? 
                  'ring-2 ring-offset-2 ring-blue-500 ' + env.badgeClass : 
                  'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                class="px-4 py-2 rounded-lg font-medium transition-all duration-200 border">
                <span class="mr-2">{{ getEnvironmentIcon(env.key) }}</span>
                {{ env.name }}
              </button>
            </div>
          </div>
          
          <!-- Environment Indicator -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Conectado a:</span>
            <span [class]="getCurrentEnvironmentBadgeClass()"
                  class="px-3 py-1 rounded-full font-semibold text-sm border">
              {{ getCurrentEnvironmentName() | uppercase }}
            </span>
          </div>
        </div>

        <!-- Warning for Production -->
        <div *ngIf="currentEnvironment === 'prod'" 
             class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-red-800 text-sm">
            <strong>¡Atención!</strong> Estás en el entorno de PRODUCCIÓN. Los cambios afectarán a los usuarios finales.
          </span>
        </div>
      </div>

      <!-- Tools Categories -->
      <div class="mb-6">
        <div class="flex space-x-2 overflow-x-auto pb-2">
          <button 
            *ngFor="let category of categories"
            (click)="selectedCategory = category.key"
            [class.bg-blue-600]="selectedCategory === category.key"
            [class.text-white]="selectedCategory === category.key"
            [class.bg-gray-200]="selectedCategory !== category.key"
            [class.text-gray-700]="selectedCategory !== category.key"
            class="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors">
            {{ category.name }} ({{ getCategoryCount(category.key) }})
          </button>
        </div>
      </div>

      <!-- Tools Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          *ngFor="let tool of getFilteredTools()"
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                 transform hover:-translate-y-1 cursor-pointer group relative"
          (click)="openTool(tool.key)">
          
          <!-- Environment Badge on Card -->
          <div class="absolute top-2 right-2 z-10">
            <span [class]="getCurrentEnvironmentBadgeClass()"
                  class="px-2 py-1 rounded-full text-xs font-semibold border">
              {{ currentEnvironment | uppercase }}
            </span>
          </div>
          
          <div class="p-8">
            <!-- Tool Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center"
                   [ngClass]="getToolColorClass(tool.key)">
                <span class="text-3xl">{{ getToolIcon(tool.key) }}</span>
              </div>
              
            </div>

            <!-- Tool Info -->
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {{ tool.value.name }}
            </h3>
            <p class="text-gray-600 mb-4">{{ tool.value.description }}</p>

            <!-- Tool Meta -->
            <div class="flex items-center justify-between text-sm">
              <span class="px-2 py-1 bg-gray-100 rounded text-gray-600">
                {{ tool.value.category }}
              </span>
              
              <button 
                (click)="openToolInNewTab($event, tool.key)"
                class="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                <span>Abrir externo</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </button>
            </div>

            <!-- URL Preview (solo visible para debugging - comentar en producción) -->
            <!--
            <div class="mt-2 pt-2 border-t">
              <p class="text-xs text-gray-400 truncate" [title]="getToolUrl(tool.key)">
                {{ getToolUrl(tool.key) }}
              </p>
            </div>
            -->
          </div>

          <!-- Hover Effect Bar with Environment Color -->
          <div class="h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
               [style.background]="'linear-gradient(to right, ' + getEnvironmentGradient() + ')'"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="getFilteredTools().length === 0" 
           class="text-center py-12 bg-white rounded-lg shadow">
        <span class="text-4xl mb-4 block">🔍</span>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No hay herramientas en esta categoría
        </h3>
        <p class="text-gray-500">Selecciona otra categoría para ver más herramientas</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ToolsGridComponent implements OnInit, OnDestroy {
  currentProject: Project | null = null;
  tools: Array<{key: string, value: Tool}> = [];
  selectedCategory: string = 'all';
  currentEnvironment: Environment = 'qa';
  environments: EnvironmentConfig[] = [];
  private destroy$ = new Subject<void>();

  categories = [
    { key: 'all', name: 'Todas' },
    { key: 'monitoring', name: 'Monitoreo' },
    { key: 'infrastructure', name: 'Infraestructura' },
    { key: 'security', name: 'Seguridad' },
    { key: 'application', name: 'Aplicación' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    // Obtener el proyecto desde el padre
    const projectId = this.route.parent?.snapshot.params['projectId'];
    if (projectId) {
      this.loadProject(projectId);
    }

    // Cargar entornos disponibles
    this.environments = this.environmentService.getAvailableEnvironments();
    
    // Suscribirse a cambios de entorno
    this.environmentService.currentEnvironment$
      .pipe(takeUntil(this.destroy$))
      .subscribe(env => {
        this.currentEnvironment = env;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProject(projectId: string): void {
    this.currentProject = this.projectService.getProjectById(projectId);
    
    if (this.currentProject) {
      // Convertir tools object a array para facilitar el manejo
      this.tools = Object.entries(this.currentProject.tools).map(([key, value]) => ({
        key,
        value
      }));
    }
  }

  selectEnvironment(env: Environment): void {
    this.environmentService.setEnvironment(env);
  }

  getFilteredTools(): Array<{key: string, value: Tool}> {
    if (this.selectedCategory === 'all') {
      return this.tools;
    }
    return this.tools.filter(tool => tool.value.category === this.selectedCategory);
  }

  getCategoryCount(category: string): number {
    if (category === 'all') {
      return this.tools.length;
    }
    return this.tools.filter(tool => tool.value.category === category).length;
  }

  openTool(toolKey: string): void {
    const url = this.getToolUrl(toolKey);
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.error(`URL no configurada para ${toolKey} en ${this.currentEnvironment}`);
      alert(`URL no configurada para ${toolKey} en el entorno ${this.currentEnvironment}`);
    }
  }

  openToolInNewTab(event: Event, toolKey: string): void {
    event.stopPropagation();
    this.openTool(toolKey);
  }

  getToolUrl(toolKey: string): string {
    if (!this.currentProject) return '#';
    return this.environmentService.getToolUrl(this.currentProject.key, toolKey);
  }

  getCurrentEnvironmentName(): string {
    const config = this.environmentService.getCurrentEnvironmentConfig();
    return config?.name || 'Desconocido';
  }

  getCurrentEnvironmentBadgeClass(): string {
    return this.environmentService.getEnvironmentBadgeClass();
  }

  getEnvironmentIcon(env: Environment): string {
    const icons = {
      'qa': '🧪',
      'prod': '🚀'
    };
    return icons[env] || '📦';
  }

  getEnvironmentGradient(): string {
    const gradients = {
      'qa': '#f59e0b, #ef4444',
      'prod': '#ef4444, #dc2626'
    };
    return gradients[this.currentEnvironment] || '#6b7280, #4b5563';
  }

  getToolIcon(toolKey: string): string {
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

  getToolColorClass(toolKey: string): string {
    const colorMap: { [key: string]: string } = {
      'grafana': 'bg-orange-100',
      'consul': 'bg-purple-100',
      'vault': 'bg-blue-100',
      'healthCheck': 'bg-green-100',
      'kubernetes': 'bg-cyan-100',
      'portalLink': 'bg-red-100'
    };
    return colorMap[toolKey] || 'bg-gray-100';
  }
}