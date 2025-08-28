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
    return profile?.family_name || profile?.name || profile?.preferred_username || 'Usuario';
  });

  public userEmail = computed(() => {
    const profile = this.userProfile();
    return profile?.email || '';
  });

  public userId = computed(() => {
    const profile = this.userProfile();
    return profile?.userId || profile?.sub || '';
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
      this.router.navigate(['/projects']);
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


  // en auth.service.ts

  // en auth.service.ts

  // en auth.service.ts

  private async loadUserProfileAndRoles(): Promise<void> {
    // Para este flujo, el id_token puede no estar presente o ser limitado.
    // Nos enfocaremos en el access_token.
    this.userProfile.set(this.oauthService.getIdentityClaims());
    console.log('AuthService: Claims (si existen):', this.userProfile());

    try {
      const accessToken = this.oauthService.getAccessToken();
      if (!accessToken) {
        throw new Error("No se encontró el access_token.");
      }

      const accessTokenPayload = this.decodeTokenPayload(accessToken);
      console.log('CONTENIDO DEL ACCESS TOKEN:', accessTokenPayload);

       this.userProfile.set(accessTokenPayload);

      // Extraemos el 'userId' del ACCESS TOKEN, como requiere tu flujo.
      const userId = accessTokenPayload?.userId;

      if (!userId) {
        // Si el nombre del claim es otro, como 'sub', ajústalo aquí.
        // const userId = accessTokenPayload?.sub; 
        throw new Error("El claim 'userId' NO FUE ENCONTRADO dentro del access_token.");
      }

      const headers = new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` });
      // Construimos la URL con el userId, como requiere tu API.
      const apiUrl = `/Auth/GetGroupsAdByUser?userId=${userId}`;
      console.log(`AuthService: Realizando llamada a: ${apiUrl}`);

      const roles = await firstValueFrom(this.http.get<GroupAD[]>(apiUrl, { headers }));

      this.userRoles.set(roles || []);
      console.log('AuthService: Roles cargados exitosamente desde la API:', roles);

    } catch (error) {
      console.error('AuthService: Fallo en el proceso de carga de roles.', error);
      this.userRoles.set([]);
    }
  }

  // Asegúrate de que tu método decodeTokenPayload siga aquí
  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Error al decodificar el token', e);
      return null;
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
    // ¡Ya comprueba tanto el 'name' como el 'guid'!
    return roles.some(role => role.name === roleIdentifier || role.guid === roleIdentifier);
  }
}