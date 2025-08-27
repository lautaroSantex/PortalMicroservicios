import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
// Importa 'withFetch' para la configuración moderna de HttpClient
import { provideHttpClient, withFetch } from '@angular/common/http'; 
import { provideAnimations } from '@angular/platform-browser/animations';

// --- ¡ESTA ES LA LÍNEA QUE FALTA! ---
import { provideOAuthClient } from 'angular-oauth2-oidc';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Importar servicios directamente
import { ApiService } from './app/core/services/api.service';
import { AuthService } from './app/core/services/auth.service';
import { NotificationService } from './app/core/services/notification.service';

bootstrapApplication(AppComponent, {
  providers: [
    // Precarga inmediata de todas las rutas
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Configuración moderna de HttpClient
    provideHttpClient(withFetch()), 
    
    provideAnimations(),
    
    // --- ¡Y AQUÍ SE AÑADE EL PROVEEDOR! ---
    provideOAuthClient()
  ]
}).catch(err => console.error(err));
