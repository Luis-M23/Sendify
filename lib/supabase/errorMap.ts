// lib/supabase/errors.ts
export const supabaseErrorMap: Record<string, string> = {
  // Proveedor / autenticación
  "anonymous_provider_disabled": "Proveedor anónimo deshabilitado",
  "bad_code_verifier": "Verificador de código incorrecto",
  "bad_json": "JSON inválido",
  "bad_jwt": "JWT inválido",
  "bad_oauth_callback": "Callback OAuth inválido",
  "bad_oauth_state": "Estado OAuth inválido",
  "captcha_failed": "Captcha fallido",
  "conflict": "Conflicto",
  "email_address_invalid": "Correo electrónico inválido",
  "email_address_not_authorized": "Correo no autorizado",
  "email_conflict_identity_not_deletable": "Conflicto de correo: identidad no eliminable",
  "email_exists": "El correo ya existe",
  "email_not_confirmed": "El correo no ha sido confirmado",
  "email_provider_disabled": "Proveedor de correo deshabilitado",
  
  // Flujo / estado
  "flow_state_expired": "Estado del flujo expirado",
  "flow_state_not_found": "Estado del flujo no encontrado",
  
  // Hooks
  "hook_payload_invalid_content_type": "Hook: tipo de contenido inválido",
  "hook_payload_over_size_limit": "Hook: payload excede tamaño límite",
  "hook_timeout": "Hook: tiempo de espera excedido",
  "hook_timeout_after_retry": "Hook: tiempo de espera tras reintento",
  
  // Identidad / MFA
  "identity_already_exists": "La identidad ya existe",
  "identity_not_found": "Identidad no encontrada",
  "insufficient_aal": "Nivel de autenticación insuficiente",
  "invalid_credentials": "Credenciales inválidas",
  "invite_not_found": "Invitación no encontrada",
  "manual_linking_disabled": "Vinculación manual deshabilitada",
  "mfa_challenge_expired": "El desafío MFA expiró",
  "mfa_factor_name_conflict": "Conflicto con el nombre del factor MFA",
  "mfa_factor_not_found": "Factor MFA no encontrado",
  "mfa_ip_address_mismatch": "Dirección IP no coincide con MFA",
  "mfa_phone_enroll_not_enabled": "Inscripción MFA por teléfono no habilitada",
  "mfa_phone_verify_not_enabled": "Verificación MFA por teléfono no habilitada",
  "mfa_totp_enroll_not_enabled": "Inscripción MFA TOTP no habilitada",
  "mfa_totp_verify_not_enabled": "Verificación MFA TOTP no habilitada",
  "mfa_verification_failed": "Verificación MFA fallida",
  "mfa_verification_rejected": "Verificación MFA rechazada",
  "mfa_verified_factor_exists": "El factor MFA ya está verificado",
  "mfa_web_authn_enroll_not_enabled": "Inscripción WebAuthn no habilitada",
  "mfa_web_authn_verify_not_enabled": "Verificación WebAuthn no habilitada",
  
  // Autorización / permisos
  "no_authorization": "Sin autorización",
  "not_admin": "No es administrador",
  "oauth_provider_not_supported": "Proveedor OAuth no soportado",
  
  // OTP
  "otp_disabled": "OTP deshabilitado",
  "otp_expired": "OTP expirado",
  
  // Límites
  "over_email_send_rate_limit": "Excedido límite de envío de correos",
  "over_request_rate_limit": "Excedido límite de solicitudes",
  "over_sms_send_rate_limit": "Excedido límite de envío de SMS",
  
  // Teléfono
  "phone_exists": "El teléfono ya existe",
  "phone_not_confirmed": "El teléfono no ha sido confirmado",
  "phone_provider_disabled": "Proveedor de teléfono deshabilitado",
  
  // Otros proveedores
  "provider_disabled": "Proveedor deshabilitado",
  "provider_email_needs_verification": "Correo del proveedor necesita verificación",
  
  // Reautenticación / tokens
  "reauthentication_needed": "Se requiere reautenticación",
  "reauthentication_not_valid": "Reautenticación inválida",
  "refresh_token_already_used": "Token de refresco ya usado",
  "refresh_token_not_found": "Token de refresco no encontrado",
  "request_timeout": "Tiempo de solicitud agotado",
  "same_password": "La contraseña es la misma",
  
  // SAML
  "saml_assertion_no_email": "SAML: assertion sin correo",
  "saml_assertion_no_user_id": "SAML: assertion sin ID de usuario",
  "saml_entity_id_mismatch": "SAML: ID de entidad no coincide",
  "saml_idp_already_exists": "SAML: IdP ya existe",
  "saml_idp_not_found": "SAML: IdP no encontrado",
  "saml_metadata_fetch_failed": "SAML: fallo al obtener metadata",
  "saml_provider_disabled": "SAML: proveedor deshabilitado",
  "saml_relay_state_expired": "SAML: relay state expirado",
  "saml_relay_state_not_found": "SAML: relay state no encontrado",
  
  // Sesión
  "session_expired": "Sesión expirada",
  "session_not_found": "Sesión no encontrada",
  
  // Registro / signup
  "signup_disabled": "Registro deshabilitado",
  "single_identity_not_deletable": "Identidad única no eliminable",
  "sms_send_failed": "Fallo al enviar SMS",
  
  // SSO
  "sso_domain_already_exists": "Dominio SSO ya existe",
  "sso_provider_not_found": "Proveedor SSO no encontrado",
  
  // MFA avanzado
  "too_many_enrolled_mfa_factors": "Demasiados factores MFA inscritos",
  
  // Fallos inesperados
  "unexpected_audience": "Audiencia inesperada",
  "unexpected_failure": "Fallo inesperado",
  
  // Usuario
  "user_already_exists": "Correo electrónico registrado",
  "user_banned": "Usuario bloqueado",
  "user_not_found": "Usuario no encontrado",
  "user_sso_managed": "Usuario gestionado por SSO",
  
  // Validación / contraseña
  "validation_failed": "Validación fallida",
  "weak_password": "Contraseña débil"
};
