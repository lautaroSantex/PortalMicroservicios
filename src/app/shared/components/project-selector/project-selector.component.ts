import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { fadeInAnimation } from '../../../../fade-in.animation';
// Import fadeInAnimation from its location (adjust the path as needed)


@Component({
  selector: 'app-project-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8" @fadeIn>
      <div class="max-w-6xl mx-auto px-4">
        
        <!-- Header Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Portal de Microservicios</h1>
          <p class="text-lg text-gray-600">Acceso centralizado a todas las herramientas de desarrollo</p>
        </div>

        <!-- Project Selector -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Seleccionar Proyecto</h2>
          
          <!-- Search Bar (opcional) -->
          <div class="mb-6">
            <input 
              type="text"
              [(ngModel)]="searchTerm"
              placeholder="Buscar proyecto..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              *ngFor="let project of filteredProjects"
              (click)="selectProject(project)"
              [attr.aria-label]="'Seleccionar proyecto ' + project.name"
              class="group relative flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg 
                     transition-all duration-200 hover:border-blue-400 hover:shadow-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500">
              
              <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 
                          group-hover:bg-blue-100 transition-colors duration-200">
                <span class="text-xl">{{ project.icon }}</span>
              </div>
              
              <div class="text-left flex-1">
                <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ project.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ project.description }}</p>
              </div>

              <!-- Status Indicator -->
              <div class="absolute top-2 right-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-green-100 text-green-800': project.status === 'active',
                        'bg-yellow-100 text-yellow-800': project.status === 'maintenance',
                        'bg-red-100 text-red-800': project.status === 'inactive'
                      }">
                  <span class="w-2 h-2 rounded-full mr-1"
                        [ngClass]="{
                          'bg-green-500': project.status === 'active',
                          'bg-yellow-500': project.status === 'maintenance',
                          'bg-red-500': project.status === 'inactive'
                        }"></span>
                  {{ getStatusText(project.status) }}
                </span>
              </div>
            </button>
          </div>

          <!-- Recent Projects -->
          <div *ngIf="recentProjects.length > 0" class="mt-8 pt-8 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Proyectos Recientes</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                *ngFor="let recent of recentProjects"
                (click)="selectProject(recent)"
                class="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                {{ recent.icon }} {{ recent.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Footer info -->
        <div class="text-center mt-12">
          <p class="text-gray-500">
            {{ projects.length }} proyectos disponibles
          </p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  animations: [fadeInAnimation]
})
export class ProjectSelectorComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  recentProjects: Project[] = [];
  searchTerm: string = '';

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