/**
 * This file is used only to determine if Angular platform should be run in production mode
 * or not. All other environment related properties are set externally and accessed using EnvironmentService.
 */
// production, shouldEncrypt, logToLoki and azureAuthEnabled are boolean variables;
// Typescript is complaining because their values aren't wrapped in quotes (Cannot find name '$PRODUCTION') and @ts-nocheck rule disables these semantic checks.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export const environment = {
  name: 'production',
  production: $PRODUCTION,
  shouldEncrypt: $SHOULD_ENCRYPT,
  appHostUrl: '${APP_HOST_URL}',
  userModuleApiUrl: '${USER_MODULE_API_URL}',
  organizationModuleApiUrl: '${ORGANIZATION_MODULE_API_URL}',
  platformModuleApiUrl: '${PLATFORM_MODULE_API_URL}',
  crmModuleApiUrl: '${CRM_MODULE_API_URL}',
  nmmModuleApiUrl: '${NMM_MODULE_API_URL}',
  dmmModuleApiUrl: '${DMM_MODULE_API_URL}',
  emmModuleApiUrl: '${EMM_MODULE_API_URL}',
  jwtClientId: '${JWT_CLIENT_ID}',
  jwtClientSecret: '${JWT_CLIENT_SECRET}',
  azureAuthEnabled: $AZURE_AUTH_ENABLED,
  azureAuthClientId: '${AZURE_AUTH_CLIENT_ID}',
  azureAuthTenantId: '${AZURE_AUTH_TENANT_ID}',
  firebase: {
    apiKey: '${FIREBASE_API_KEY}',
    authDomain: '${FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${FIREBASE_DATABASE_URL}',
    projectId: '${FIREBASE_PROJECT_ID}',
    storageBucket: '${FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${FIREBASE_APP_ID}',
    measurementId: '${FIREBASE_MEASUREMENT_ID}',
  },
  firebaseVapidKey: '${FIREBASE_VAPID_KEY}',
  firebaseRecaptchaSiteKey: '${FIREBASE_RECAPTCHA_SITE_KEY}',
  firebaseRecaptchaSecretKey: '${FIREBASE_RECAPTCHA_SECRET_KEY}',
  logToLoki: $LOG_TO_LOKI,
  logstashHostUrl: '${LOGSTASH_HOST_URL}',
  lokiLogUrl: '${LOKI_LOG_URL}',
};
