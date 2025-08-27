import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // Dejamos el issuer vacío para el modo manual (sin discovery)
  issuer: '',

  // --- CAMBIO CLAVE ---
  // Usamos rutas RELATIVAS para que el proxy las intercepte.
  // El proxy se encargará de añadir "https://csbpnauthapidesa.ar.bpn"
  loginUrl: '/connect/authorize',
  tokenEndpoint: '/connect/token',
  
  // URL de redirección después del login
  redirectUri: window.location.origin + '/callback',
  
  clientId: 'angular-microservices',
  responseType: 'code',
  scope: 'openid offline_access apiSugus',
  
  // Deshabilitamos el descubrimiento automático para evitar CORS
  oidc: false,

  showDebugInformation: true,
  dummyClientSecret: 'secret',
  requireHttps: false
};