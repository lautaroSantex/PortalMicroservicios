import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';

export const appConfig: ApplicationConfig = {
 providers: [
    // Configurar router
    provideRouter(routes),
    
    // Configurar HTTP con interceptors y fetch API
    provideHttpClient(
      withFetch(), // Usar Fetch API en lugar de XMLHttpRequest
    ),
    
    // Animaciones si las necesitas
    provideAnimations(),
    
    // Configurar OAuth
    importProvidersFrom(
      OAuthModule.forRoot({
        resourceServer: {
          allowedUrls: [
            'https://localhost:7095', // Tu API de SUGUS
            'https://localhost:44337' // Tu servidor OpenIddict
          ],
          sendAccessToken: true
        }
      })
    ),
    
    // Provider personalizado para el storage
    { provide: OAuthStorage, useFactory: storageFactory }
  ]
};

// Factory function for OAuthStorage
export function storageFactory(): OAuthStorage {
  return localStorage;
}
