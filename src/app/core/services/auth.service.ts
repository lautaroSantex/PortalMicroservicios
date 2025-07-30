import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Simular usuario logueado inmediatamente para evitar cambios visuales
    this.simulateLoggedUser();
    // Verificar token después
    this.checkAuthStatus();
  }

  private simulateLoggedUser(): void {
    // Para demo, simular un usuario logueado inmediatamente
    const user: User = {
      id: '1',
      name: 'Lautaro ruiz diaz',
      email: 'ruizla@bpn.com.ar',
      role: 'admin'
    };
    
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('auth_token', 'demo-token-' + Date.now());
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      // Aquí verificarías la validez del token
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    // Aquí implementarías la lógica real de login
    return new Observable(observer => {
      // Simular llamada a API
        if (email === 'admin@company.com' && password === 'admin123') {
          const user: User = {
            id: '1',
            name: 'Admin Dev',
            email: 'admin@company.com',
            role: 'admin'
          };
          
          const token = 'fake-jwt-token-' + Date.now();
          
          localStorage.setItem('auth_token', token);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          
          observer.next({ user, token });
          observer.complete();
        } else {
          observer.error({ message: 'Credenciales inválidas' });
        }
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  // Guard helper methods
  canAccessGrafana(): boolean {
    const user = this.getCurrentUser();
    return user ? ['admin', 'operator'].includes(user.role) : false;
  }

  canAccessVault(): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === 'admin' : false;
  }

  canAccessConsul(): boolean {
    const user = this.getCurrentUser();
    return user ? ['admin', 'operator'].includes(user.role) : false;
  }
}