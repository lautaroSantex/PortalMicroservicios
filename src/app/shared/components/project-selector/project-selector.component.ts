import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { fadeInAnimation } from '../../../../fade-in.animation';

@Component({
  selector: 'app-project-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50" @fadeIn>
      <!-- Elementos decorativos de fondo -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        <!-- Header Section -->
        <div class="text-center mb-12">
          <!-- Logo y título -->      
          <h1 class="text-4xl font-bold mb-4">
            <span class="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Centro de Control de
            </span>
            <span class="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Microservicios
            </span>
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Acceso centralizado a todas las herramientas y servicios de desarrollo del banco
          </p>
          
          <!-- Stats badges -->
          <div class="flex items-center justify-center gap-4 mt-6">
            <div class="inline-flex items-center px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span class="text-sm font-medium text-gray-700">Sistema Operativo</span>
            </div>
            <div class="inline-flex items-center px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <svg class="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">{{ projects.length }} Proyectos</span>
            </div>
          </div>
        </div>

        <!-- Main Card -->
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 max-w-5xl mx-auto">
          
          <!-- Section Header -->
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Seleccionar Proyecto</h2>
              <p class="text-sm text-gray-500 mt-1">Elige el aplicativo al que deseas acceder</p>
            </div>
            
            <!-- View Toggle (optional) -->
            <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button 
                (click)="viewMode = 'grid'"
                [class.bg-white]="viewMode === 'grid'"
                [class.shadow-sm]="viewMode === 'grid'"
                class="p-2 rounded transition-all">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button 
                (click)="viewMode = 'list'"
                [class.bg-white]="viewMode === 'list'"
                [class.shadow-sm]="viewMode === 'list'"
                class="p-2 rounded transition-all">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Search Bar -->
          <div class="relative mb-8">
            <input 
              type="text"
              [(ngModel)]="searchTerm"
              placeholder="Buscar proyecto por nombre o descripción..."
              class="w-full px-12 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                     transition-all placeholder-gray-400">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span *ngIf="searchTerm" class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {{ filteredProjects.length }} resultados
            </span>
          </div>
          
          <!-- Projects Grid/List -->
          <div [ngClass]="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'">
            <button 
              *ngFor="let project of filteredProjects; let i = index"
              (click)="selectProject(project)"
              [attr.aria-label]="'Seleccionar proyecto ' + project.name"
              class="group relative flex items-center p-5 bg-gradient-to-br from-white to-gray-50
                     border border-gray-200 rounded-xl
                     transition-all duration-300 hover:shadow-lg hover:border-cyan-300 hover:scale-[1.02]
                     focus:outline-none focus:ring-2 focus:ring-cyan-500"
              [style.animation-delay.ms]="i * 50">
              
              <!-- Status Indicator -->
              <div class="absolute top-3 right-3">
                <span 
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                  [ngClass]="{
                    'bg-green-100 text-green-700': project.status === 'active',
                    'bg-yellow-100 text-yellow-700': project.status === 'maintenance',
                    'bg-gray-100 text-gray-700': project.status === 'inactive'
                  }">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5"
                    [ngClass]="{
                      'bg-green-500': project.status === 'active',
                      'bg-yellow-500': project.status === 'maintenance',
                      'bg-gray-500': project.status === 'inactive'
                    }"></span>
                  {{ getStatusText(project.status) }}
                </span>
              </div>
              
              <!-- Icon Container -->
              <div class="w-14 h-14 rounded-xl flex items-center justify-center mr-4
                          bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100
                          group-hover:from-cyan-100 group-hover:to-blue-100 transition-colors">
                <span class="text-2xl group-hover:scale-110 transition-transform">{{ project.icon }}</span>
              </div>
              
              <!-- Project Info -->
              <div class="flex-1 text-left">
                <h3 class="font-semibold text-gray-900 text-lg mb-1 group-hover:text-cyan-700 transition-colors">
                  {{ project.name }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2">{{ project.description }}</p>
                
                <!-- Tags (if applicable) -->
                <div *ngIf="project.tags && project.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                  <span *ngFor="let tag of project.tags.slice(0, 3)" 
                    class="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Arrow Icon -->
              <div class="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </div>

          <!-- No Results -->
          <div *ngIf="filteredProjects.length === 0 && searchTerm" 
               class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-500">No se encontraron proyectos con "<span class="font-semibold">{{ searchTerm }}</span>"</p>
            <button (click)="searchTerm = ''" class="mt-3 text-cyan-600 hover:text-cyan-700 font-medium">
              Limpiar búsqueda
            </button>
          </div>

          <!-- Recent Projects -->
          <div *ngIf="recentProjects.length > 0 && !searchTerm" 
               class="mt-10 pt-8 border-t border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Accesos Recientes
              </h3>
              <button (click)="clearRecent()" class="text-sm text-gray-500 hover:text-gray-700">
                Limpiar
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button 
                *ngFor="let recent of recentProjects"
                (click)="selectProject(recent)"
                class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 
                       border border-cyan-200 text-cyan-700 rounded-lg 
                       hover:from-cyan-100 hover:to-blue-100 hover:shadow-md 
                       transition-all group">
                <span class="mr-2">{{ recent.icon }}</span>
                <span class="font-medium">{{ recent.name }}</span>
                <svg class="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer info -->
        <div class="text-center mt-8">
          <p class="text-sm text-gray-500">
            Banco Provincia del Neuquén · Portal de Microservicios v1.0.0
          </p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    button[class*="group"] {
      animation: slideUp 0.4s ease-out backwards;
    }

    .line-clamp-2 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  `],
  animations: [fadeInAnimation]
})
export class ProjectSelectorComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  recentProjects: Project[] = [];
  searchTerm: string = '';
  viewMode: 'grid' | 'list' = 'grid';
  logoPath = '/assets/images/bpn-logo.png'; // Ajusta esta ruta

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadRecentProjects();
  }

  private loadProjects(): void {
    this.projects = this.projectService.getAllProjects();
    this.filteredProjects = [...this.projects];
  }

  private loadRecentProjects(): void {
    const recentIds = this.projectService.getRecentProjectIds();
    this.recentProjects = this.projects.filter(p => recentIds.includes(p.key));
  }

  selectProject(project: Project): void {
    // Guardar en recientes
    this.projectService.addToRecent(project.key);
    
    // Guardar proyecto actual en el servicio
    this.projectService.setCurrentProject(project);
    
    // Navegar a la ruta del proyecto
    this.router.navigate(['/project', project.key]);
    
    console.log(`✅ Navegando al proyecto: ${project.name}`);
  }

  getStatusText(status: string | undefined): string {
    if (!status) return 'Desconocido';
    
    const statusMap: { [key: string]: string } = {
      'active': 'Activo',
      'maintenance': 'Mantenimiento',
      'inactive': 'Inactivo'
    };
    return statusMap[status] || status;
  }

  clearRecent(): void {
    this.projectService.clearRecent();
    this.recentProjects = [];
  }

  onLogoError(event: any): void {
    console.warn('No se pudo cargar el logo desde:', this.logoPath);
    // Podrías establecer una imagen de fallback aquí
  }

  // Watcher para el buscador
  ngDoCheck(): void {
    if (this.searchTerm) {
      this.filteredProjects = this.projects.filter(p => 
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProjects = [...this.projects];
    }
  }
}