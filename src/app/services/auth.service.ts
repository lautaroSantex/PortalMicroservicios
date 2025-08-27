import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { filter, firstValueFrom } from 'rxjs'; // <-- CAMBIO: Importar firstValueFrom
import { authConfig } from '../guards/auth.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Reutilizamos la interfaz que ya tenías
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
  private router = inject(Router);
  private oauthService = inject(OAuthService);
  private http = inject(HttpClient);

  public isAuthenticated = signal<boolean>(false);
  public userProfile = signal<any>(null);
  public userRoles = signal<GroupAD[]>([]);
  public isInitialized = signal<boolean>(false);

  // <-- CAMBIO: Bandera para prevenir bucles de redirección
  private loginInProgress = false;

  constructor() {
    this.configureAuth();
  }

  private async configureAuth() {
    this.oauthService.configure(authConfig);

    this.oauthService.events
      .pipe(filter((e: OAuthEvent) => e.type === 'token_received'))
      .subscribe(async () => {
        console.log('AuthService: Token recibido.');
        this.loginInProgress = false; // <-- CAMBIO: Reiniciar bandera al recibir token
        this.isAuthenticated.set(true);
        await this.loadUserProfileAndRoles();
      });

    try {
      await this.oauthService.tryLogin();
      
      if (this.oauthService.hasValidAccessToken()) {
        console.log('AuthService: Sesión válida encontrada al iniciar.');
        this.isAuthenticated.set(true);
        await this.loadUserProfileAndRoles();
        this.oauthService.setupAutomaticSilentRefresh();
      }
    } catch (error) {
      console.error('AuthService: Error en la configuración inicial.', error);
    } finally {
        this.isInitialized.set(true);
    }
  }

  private async loadUserProfileAndRoles(): Promise<void> {
    let claims = this.oauthService.getIdentityClaims();
    if (!claims) {
        const idToken = this.oauthService.getIdToken();
        if (idToken) {
            claims = this.decodeToken(idToken);
        }
    }
    this.userProfile.set(claims);
    console.log('AuthService: Claims cargados:', claims);

    try {
      const accessToken = this.oauthService.getAccessToken();
      const accessTokenPayload = this.decodeToken(accessToken);
      const userId = accessTokenPayload?.userId;

      if (!userId) {
        console.error("AuthService: No se encontró 'userId' en el access token.");
        return;
      }

      const headers = new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` });
      // <-- CAMBIO: Usar firstValueFrom en lugar de toPromise()
      const roles = await firstValueFrom(this.http.get<GroupAD[]>(`/Auth/GetGroupsAdByUser?userId=${userId}`, { headers }));
      
      this.userRoles.set(roles || []);
      console.log('AuthService: Roles cargados desde la API:', roles);

    } catch (error) {
      console.error('AuthService: Error cargando los roles del usuario.', error);
      this.userRoles.set([]);
    }
  }

  public login(): void {
    // <-- CAMBIO: Lógica para prevenir llamadas múltiples
    if (this.loginInProgress) {
      console.warn('AuthService: Login ya en progreso, evitando nueva redirección.');
      return;
    }
    this.loginInProgress = true;
    this.oauthService.initCodeFlow();
  }

  public logout(): void {
    this.oauthService.logOut();
    this.isAuthenticated.set(false);
    this.userProfile.set(null);
    this.userRoles.set([]);
  }

  public hasRole(roleIdentifier: string): boolean {
    if (!roleIdentifier) return true; 
    const roles = this.userRoles();
    return roles.some(role => role.name === roleIdentifier || role.guid === roleIdentifier);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch (e) {
      return null;
    }
  }
}
