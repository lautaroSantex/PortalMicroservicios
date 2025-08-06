// src/app/services/environment.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Environment, ENVIRONMENTS, TOOL_URLS, EnvironmentConfig } from '../config/environment.config';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private currentEnvironmentSubject = new BehaviorSubject<Environment>('qa');
  public currentEnvironment$ = this.currentEnvironmentSubject.asObservable();

  constructor() {
    // Cargar entorno guardado o usar QA por defecto
    const savedEnv = localStorage.getItem('selectedEnvironment') as Environment;
    if (savedEnv && this.isValidEnvironment(savedEnv)) {
      this.currentEnvironmentSubject.next(savedEnv);
    }
  }

  /**
   * Obtiene el entorno actual
   */
  getCurrentEnvironment(): Environment {
    return this.currentEnvironmentSubject.value;
  }

  /**
   * Cambia el entorno actual
   */
  setEnvironment(env: Environment): void {
    if (this.isValidEnvironment(env)) {
      this.currentEnvironmentSubject.next(env);
      localStorage.setItem('selectedEnvironment', env);
    }
  }

  /**
   * Obtiene la configuración del entorno actual
   */
  getCurrentEnvironmentConfig(): EnvironmentConfig | undefined {
    return ENVIRONMENTS.find(env => env.key === this.getCurrentEnvironment());
  }

  /**
   * Obtiene todos los entornos disponibles
   */
  getAvailableEnvironments(): EnvironmentConfig[] {
    return ENVIRONMENTS;
  }

  /**
   * Obtiene la URL de una herramienta para el entorno actual
   */
  getToolUrl(projectKey: string, toolKey: string): string {
    const currentEnv = this.getCurrentEnvironment();
    
    // Type assertions para resolver el error de TypeScript
    const projectUrls = TOOL_URLS[projectKey as keyof typeof TOOL_URLS];
    
    if (projectUrls && 
        projectUrls[currentEnv] && 
        projectUrls[currentEnv][toolKey]) {
      return projectUrls[currentEnv][toolKey];
    }
    
    // Fallback a QA si no existe la URL para el entorno actual
    if (projectUrls && 
        projectUrls['qa'] && 
        projectUrls['qa'][toolKey]) {
      console.warn(`URL no encontrada para ${projectKey}/${toolKey} en ${currentEnv}, usando QA`);
      return projectUrls['qa'][toolKey];
    }
    
    console.error(`URL no encontrada para ${projectKey}/${toolKey}`);
    return '#';
  }

  /**
   * Verifica si un entorno es válido
   */
  private isValidEnvironment(env: string): env is Environment {
    return ['qa', 'prod'].includes(env);
  }

  /**
   * Obtiene el color del entorno
   */
  getEnvironmentColor(): string {
    const config = this.getCurrentEnvironmentConfig();
    return config?.color || '#gray';
  }

  /**
   * Obtiene las clases CSS para el badge del entorno
   */
  getEnvironmentBadgeClass(): string {
    const config = this.getCurrentEnvironmentConfig();
    return config?.badgeClass || 'bg-gray-100 text-gray-800';
  }
}