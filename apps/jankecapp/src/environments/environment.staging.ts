export const environment = {
  name: 'staging',
  production: false,
  shouldEncrypt: true,
  appHostUrl: 'https://fiyu-jankec-staging.fiyu.online',
  userModuleApiUrl: 'https://fiyu-jankec-staging-user.fiyu.online/user',
  organizationModuleApiUrl: 'https://fiyu-jankec-staging-organization.fiyu.online/organization',
  platformModuleApiUrl: 'https://fiyu-jankec-staging-platform.fiyu.online/platform',
  crmModuleApiUrl: 'https://fiyu-jankec-staging-crm.fiyu.online/crm',
  nmmModuleApiUrl: 'https://fiyu-jankec-staging-nmm.fiyu.online/nmm',
  dmmModuleApiUrl: 'https://fiyu-jankec-staging-document.fiyu.online/dmm',
  emmModuleApiUrl: 'https://fiyu-jankec-staging-email.fiyu.online/emm',
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
