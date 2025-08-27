import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
// Importa 'withFetch' para la configuración moderna de HttpClient
import { provideHttpClient, withFetch } from '@angular/common/http'; 
import { provideAnimations } from '@angular/platform-browser/animations';

// --- ¡ESTA ES LA LÍNEA QUE FALTA! ---

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent, {
  providers: [
    // Precarga inmediata de todas las rutas
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Configuración moderna de HttpClient
    provideHttpClient(withFetch()), 
    
    provideAnimations(),
    // Servicios

  ]
}).catch(err => console.error(err));
