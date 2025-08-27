import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // HttpClientModule no se importa aquí
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './guards/auth.config';
import { filter } from 'rxjs/operators';

// Interfaz para los roles/grupos
export interface GroupAD {
  id: number;
  guid: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], // HttpClientModule se provee globalmente, no aquí
  template: `
    <!-- HTML con el botón de Iniciar Sesión -->
    <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 900px; margin: auto;">
      <h1 style="color: #333;">Portal Microservicios - Test OAuth</h1>
      
      <!-- SECCIÓN DE LOGIN: Visible solo si no está autenticado -->
      <div *ngIf="!isAuthenticated" style="margin: 20px 0;">
          <p>Para continuar, por favor inicia sesión.</p>
          <button 
            (click)="login()"
            style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Iniciar Sesión
          </button>
      </div>

      <!-- SECCIÓN PRINCIPAL: Visible solo si está autenticado -->
      <div *ngIf="isAuthenticated">
        <div style="margin: 20px 0; padding: 20px; background: #f0f0f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="margin-top: 0; color: #0056b3;">Estado de Autenticación</h2>
          <p><strong>Autenticado:</strong> SÍ ✅</p>
          <p><strong>Usuario:</strong> {{ username || 'No disponible' }}</p>
          <p><strong>Token:</strong> {{ hasToken ? 'SÍ ✅' : 'NO ❌' }}</p>

          <div *ngIf="roles.length > 0">
            <p><strong>Perfiles/Roles:</strong></p>
            <ul style="margin-top: 5px; padding-left: 20px; max-height: 200px; overflow-y: auto; background: white; border: 1px solid #ddd; border-radius: 5px; padding: 10px;">
              <li *ngFor="let role of roles">{{ role.name }}</li>
            </ul>
          </div>
          <p *ngIf="isLoadingRoles">Cargando perfiles...</p>
        </div>

        <div style="margin: 20px 0;">
          <button 
            (click)="logout()"
            style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div *ngIf="errorMessage" style="margin: 20px 0; padding: 20px; background: #f8d7da; border-radius: 5px; color: #721c24;">
        <h3>Error:</h3>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  username = '';
  hasToken = false;
  errorMessage = '';
  isLoadingRoles = false;
  roles: GroupAD[] = [];

  constructor(private oauthService: OAuthService, private http: HttpClient) {}

  ngOnInit() {
    this.configureOAuth();
  }

  private configureOAuth() {
    this.oauthService.configure(authConfig);

    this.oauthService.events
      .pipe(filter(e => e.type === 'token_received'))
      .subscribe(() => {
        console.log('Token recibido. Actualizando estado y cargando roles...');
        this.updateStateAndLoadRoles();
      });
    
    this.oauthService.tryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        console.log('Sesión válida encontrada al iniciar.');
        this.updateStateAndLoadRoles();
      }
    });
  }

  private updateStateAndLoadRoles() {
    this.isAuthenticated = this.oauthService.hasValidAccessToken();
    this.hasToken = !!this.oauthService.getAccessToken();

    let claims = this.oauthService.getIdentityClaims();
    if (!claims) {
        const idToken = this.oauthService.getIdToken();
        claims = this.decodeToken(idToken);
    }
    
    if (claims) {
      this.username = claims['family_name'] || claims['name'] || claims['sub'];
    }
    
    if (this.isAuthenticated) {
      this.loadRoles();
    }
  }

  private loadRoles() {
    this.isLoadingRoles = true;
    this.roles = [];
    
    const accessToken = this.oauthService.getAccessToken();
    const accessTokenPayload = this.decodeToken(accessToken);
    const userId = accessTokenPayload?.userId;

    if (!userId) {
      this.errorMessage = "No se pudo encontrar el userId en el token de acceso.";
      this.isLoadingRoles = false;
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` });
    const apiUrl = `/Auth/GetGroupsAdByUser?userId=${userId}`;

    this.http.get<GroupAD[]>(apiUrl, { headers }).subscribe({
      next: (groups) => {
        this.roles = groups;
        this.isLoadingRoles = false;
        console.log('Roles cargados:', this.roles);
      },
      error: (err) => {
        this.errorMessage = `Error al cargar perfiles: ${err.message}. Revisa la consola.`;
        this.isLoadingRoles = false;
        console.error('Error en la llamada a GetGroupsAdByUser:', err);
      }
    });
  }

  public login(): void {
    this.oauthService.initCodeFlow();
  }

  public logout(): void {
    this.oauthService.logOut();
    this.isAuthenticated = false;
    this.username = '';
    this.roles = [];
  }

  private decodeToken(token: string | null): any {
    if (!token) {
      return null;
    }
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error al decodificar el token', e);
      return null;
    }
  }
}
