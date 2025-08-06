import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Project, Tool } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';


@Component({
  selector: 'app-tools-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fade-in">
      <!-- Stats Cards - COMENTADO POR AHORA -->
      <!-- 
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Uptime</p>
              <p class="text-2xl font-bold" [class.text-green-600]="metrics?.uptime > 99">
                {{ metrics?.uptime || 0 }}%
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span class="text-xl">✅</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Tiempo de Respuesta</p>
              <p class="text-2xl font-bold" [class.text-yellow-600]="metrics?.responseTime > 100">
                {{ metrics?.responseTime || 0 }}ms
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-xl">⚡</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Tasa de Error</p>
              <p class="text-2xl font-bold" [class.text-red-600]="metrics?.errorRate > 1">
                {{ metrics?.errorRate || 0 }}%
              </p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span class="text-xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>
      -->

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
                 transform hover:-translate-y-1 cursor-pointer group"
          (click)="openTool(tool.key)">
          
          <div class="p-8">
            <!-- Tool Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center"
                   [ngClass]="getToolColorClass(tool.key)">
                <span class="text-3xl">{{ getToolIcon(tool.key) }}</span>
              </div>
              
              <!-- Status Indicator -->
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-xs text-gray-500">Online</span>
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
                (click)="openToolInNewTab($event, tool.value.url)"
                class="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                <span>Abrir externo</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Hover Effect Bar -->
          <div class="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 
                      group-hover:scale-x-100 transition-transform duration-300"></div>
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
export class ToolsGridComponent implements OnInit {
  currentProject: Project | null = null;
  tools: Array<{key: string, value: Tool}> = [];
  
  // Métricas comentadas por ahora - descomentar cuando se necesiten
  // metrics: any = null;
  
  selectedCategory: string = 'all';

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
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // Obtener el proyecto desde el padre
    const projectId = this.route.parent?.snapshot.params['projectId'];
    if (projectId) {
      this.loadProject(projectId);
    }
  }

  private loadProject(projectId: string): void {
    this.currentProject = this.projectService.getProjectById(projectId);
    
    if (this.currentProject) {
      // Convertir tools object a array para facilitar el manejo
      this.tools = Object.entries(this.currentProject.tools).map(([key, value]) => ({
        key,
        value
      }));
      
      // Cargar métricas - comentado por ahora
      // this.metrics = this.currentProject.metrics;
    }
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
    // Por ahora, abrir directamente la URL externa
    const tool = this.tools.find(t => t.key === toolKey);
    if (tool && tool.value.url) {
      window.open(tool.value.url, '_blank', 'noopener,noreferrer');
    }
    
    // Código original comentado para uso futuro cuando quieras navegar internamente
    // const route = this.getToolRoute(toolKey);
    // this.router.navigate(['../', route], { relativeTo: this.route });
  }

  openToolInNewTab(event: Event, url: string): void {
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
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