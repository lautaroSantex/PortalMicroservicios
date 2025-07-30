import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

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
    provideHttpClient(),
    provideAnimations(),
    // Servicios
    ApiService,
    AuthService,
    NotificationService
  ]
}).catch(err => console.error(err));