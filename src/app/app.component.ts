import { Component } from '@angular/core';
import { LayoutComponent } from './shared/components/layout/layout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LayoutComponent,
    // Precargar todos los componentes

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'microservices-portal';
}