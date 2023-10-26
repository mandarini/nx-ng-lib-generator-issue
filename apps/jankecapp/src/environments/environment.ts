/**
 * This file is used only to determine if Angular platform should be run in production mode
 * or not. All other environment related properties are set externally and accessed using EnvironmentService.
 */
export const environment = {
  name: 'serve',
  production: false,
  shouldEncrypt: false,
  appHostUrl: 'https://localhost:4200',
  userModuleApiUrl: 'https://localhost:8090/user',
  organizationModuleApiUrl: 'https://localhost:8091/organization',
  platformModuleApiUrl: 'https://localhost:8092/platform',
  crmModuleApiUrl: 'https://localhost:8097/crm',
  nmmModuleApiUrl: 'https://localhost:8093/nmm',
  dmmModuleApiUrl: 'https://localhost:8094/dmm',
  emmModuleApiUrl: 'https://localhost:8095/emm',
  jankecModuleApiUrl: 'https://localhost:8099/jankec',
  jwtClientId: '',
  jwtClientSecret: '',
  azureAuthEnabled: false,
  azureAuthClientId: '',
  azureAuthTenantId: '',
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  },
  firebaseVapidKey: '',
  firebaseRecaptchaSiteKey: '',
  firebaseRecaptchaSecretKey: '',
  logToLoki: false,
  logstashHostUrl: '',
  lokiLogUrl: '',
};
