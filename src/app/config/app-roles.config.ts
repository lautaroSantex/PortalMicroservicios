/**
 * Diccionario centralizado de los GUIDs de los roles de Active Directory
 * que son relevantes para esta aplicación.
 * Mapeamos un nombre legible para nosotros a su GUID inmutable.
 */
export const APP_ROLES = {
  // Ejemplos basados en los roles que hemos visto:
  
  // Rol para "Acceso VPN Tech"
  ACCESO_VPN_TECH: '041fb7b6-a883-4114-a4e9-5063f8cd203f',

  // Rol para "JUDICIALES_TST_SQL_R" (Inventaré un GUID para el ejemplo)
  USUARIO_JUDICIALES: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',

  // Rol para "03-0192_RecursosTecnicos_R"
  RECURSOS_TECNICOS: 'guid-de-recursos-tecnicos-aqui',
  
  // Puedes añadir aquí todos los roles que te sirvan.
  ADMIN_PLATAFORMA: 'guid-del-rol-de-admin-aqui',

 ROL_SUPER_SECRETO_INEXISTENTE: 'guid-falso-para-probar-123456789'
};