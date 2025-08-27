import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { filter, firstValueFrom } from 'rxjs';
import { authConfig } from '../guards/auth.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface GroupAD {
  id: number;
  guid: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oauthService = inject(OAuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  // --- SEÑALES DE ESTADO ---
  public isAuthenticated = signal<boolean>(false);
  public userProfile = signal<any>(null);
  public userRoles = signal<GroupAD[]>([]);
  public isInitialized = signal<boolean>(false);

  // --- SEÑALES COMPUTADAS (Derivadas del estado) ---
  public username = computed(() => {
    const profile = this.userProfile();
    return profile?.name || profile?.preferred_username || 'Usuario';
  });

  constructor() {
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();

    // Nos suscribimos a los eventos para reaccionar a cambios
    this.oauthService.events.subscribe(this.handleAuthEvents.bind(this));

    // Intentamos loguear al iniciar la app
    this.oauthService.tryLogin().then(() => {
      if (this.hasValidToken()) {
        this.updateAuthState(true);
      }
    }).finally(() => {
        this.isInitialized.set(true);
    });
  }
  
  private handleAuthEvents(event: OAuthEvent) {
    if (event.type === 'token_received') {
      console.log('AuthService: Token recibido.');
      this.updateAuthState(true);
      // Redirigir al dashboard después de un login exitoso
      this.router.navigate(['/dashboard']); 
    }
  }
  
  private async updateAuthState(isAuthenticated: boolean) {
    this.isAuthenticated.set(isAuthenticated);
    if (isAuthenticated) {
      await this.loadUserProfileAndRoles();
    } else {
      this.userProfile.set(null);
      this.userRoles.set([]);
    }
  }

  private async loadUserProfileAndRoles(): Promise<void> {
    // 1. Cargar el perfil del id_token
    const claims = this.oauthService.getIdentityClaims();
    this.userProfile.set(claims);
    console.log('AuthService: Claims cargados:', claims);

    // 2. Cargar los roles/grupos desde tu API
    try {
      const accessToken = this.oauthService.getAccessToken();
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` });
      
      // Asumimos que el userId viene en los claims del token
      const userId = claims['sub'] || claims['userId']; // 'sub' es el estándar, ajusta si es otro
      if (!userId) {
        throw new Error("No se encontró el 'userId' en los claims del token.");
      }

      const roles = await firstValueFrom(this.http.get<GroupAD[]>(`/Auth/GetGroupsAdByUser?userId=${userId}`, { headers }));
      this.userRoles.set(roles || []);
      console.log('AuthService: Roles cargados desde la API:', roles);

    } catch (error) {
      console.error('AuthService: Error cargando los roles del usuario.', error);
      this.userRoles.set([]);
    }
  }

  public login(): void {
    this.oauthService.initCodeFlow();
  }

  public logout(): void {
    this.oauthService.logOut();
    this.updateAuthState(false);
  }

  public hasValidToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  /**
   * Verifica si el usuario actual tiene uno o más roles.
   * @param roleIdentifier El nombre o GUID del rol a verificar.
   * @returns `true` si el usuario tiene el rol, `false` en caso contrario.
   */
  public hasRole(roleIdentifier: string): boolean {
    const roles = this.userRoles();
    return roles.some(role => role.name === roleIdentifier || role.guid === roleIdentifier);
  }
}