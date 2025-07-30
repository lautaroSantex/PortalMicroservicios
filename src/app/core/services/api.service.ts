import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Aquí puedes agregar headers de autenticación
      // 'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Métodos para Grafana
  getGrafanaDashboards(): Observable<any> {
    return this.http.get(`${this.baseUrl}/grafana/dashboards`, { 
      headers: this.getHeaders() 
    });
  }

  // Métodos para Consul
  getConsulServices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/consul/services`, { 
      headers: this.getHeaders() 
    });
  }

  getConsulHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/consul/health`, { 
      headers: this.getHeaders() 
    });
  }

  // Métodos para Vault
  getVaultStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vault/status`, { 
      headers: this.getHeaders() 
    });
  }

  getVaultSecrets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vault/secrets`, { 
      headers: this.getHeaders() 
    });
  }

  // Métodos generales para microservicios
  getServiceStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services/status`, { 
      headers: this.getHeaders() 
    });
  }

  getServiceMetrics(serviceName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/services/${serviceName}/metrics`, { 
      headers: this.getHeaders() 
    });
  }

  // Método genérico para cualquier endpoint
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { 
      headers: this.getHeaders() 
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders() 
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders() 
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { 
      headers: this.getHeaders() 
    });
  }
}