import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  makeEnvironmentProviders,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { LC_LANG, provideFeatureFlags, VALIDATION_ERRORS_TOKEN } from '@fiyu/api';
import {
  CacheInterceptor,
  CacheRepository,
  CustomTitleStrategy,
  EnvironmentService,
  ErrorInterceptor,
  LogInterceptor,
  OrganizationInterceptor,
  provideCoreModuleServices,
} from '@fiyu/core';
import { provideCrmModuleProviders } from '@fiyu/crm';
import { provideDocumentsModuleProviders } from '@fiyu/documents';
import { provideNotificationsModuleProviders } from '@fiyu/notifications';
import { provideOrganizationsModuleProviders } from '@fiyu/organizations';
import { providePlatformModuleProviders } from '@fiyu/platform';
import { provideUsersModuleProviders } from '@fiyu/users';
import { provideJankecModuleProviders } from '@nas/jankec';
import { TranslateLoader, TranslateModule, TranslateModuleConfig, TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { firstValueFrom } from 'rxjs';
import { AppRoutes } from './app/app.routes';
import { validationErrors } from './app/module-validation-errors';
import { HttpLoaderFactory } from './app/utils/init-locale';
import { provideWorkspaceModuleProviders } from './app/workspace/module-providers';
import { environment } from './environments/environment';

export function appInitializerFactory(translateService: TranslateService, environmentService: EnvironmentService) {
  return async () => {
    Object.assign(environmentService, environment);
    environmentService.environment = environment.name;
    environmentService.readyObservable.next(true);
    environmentService.readyObservable.complete();
    const lang = localStorage.getItem(LC_LANG) || 'en';
    translateService.setDefaultLang('en');
    await firstValueFrom(translateService.use(lang));
  };
}

function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(`[${logLevel}]: ${message}`);
}

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azureAuthClientId,
      authority: `https://login.microsoftonline.com/${environment.azureAuthTenantId}/`,
      redirectUri: environment.appHostUrl,
      postLogoutRedirectUri: `${environment.appHostUrl}/login`,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['openid'],
    },
    // loginFailedRoute: '/login-failed'
  };
}

const translateModuleConfig: TranslateModuleConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
  useDefaultLang: true,
};

const cookieConsentConfig: NgcCookieConsentConfig = {
  enabled: environment.production,
  autoOpen: environment.production,
  revokable: environment.production,
  cookie: {
    domain: new URL(environment.appHostUrl)?.host ?? 'localhost', // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  position: 'bottom',
  theme: 'classic', // 'block', 'classic', 'edgeless'
  palette: {
    popup: {
      background: '#000000',
      text: '#ffffff',
      link: '#ffffff',
    },
    button: {
      background: '#f1d600',
      text: '#000000',
      border: 'transparent',
    },
  },
  type: 'opt-out',
  content: {
    allow: 'Allow cookies',
    deny: 'Refuse cookies',
    dismiss: 'Got it!',
    header: 'Cookies used on the website!',
    link: 'Learn more',
    message: 'This website uses cookies to ensure you get the best experience on our website.',
    policy: 'Cookie Policy',
    href: `${environment.appHostUrl}/privacy-policy`,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideCoreModuleServices(),
    provideWorkspaceModuleProviders(),
    providePlatformModuleProviders(),
    provideDocumentsModuleProviders(),
    provideNotificationsModuleProviders(),
    provideOrganizationsModuleProviders(),
    provideUsersModuleProviders(),
    provideCrmModuleProviders(),
    provideJankecModuleProviders(),
    importProvidersFrom(
      TranslateModule.forRoot(translateModuleConfig),
      NgcCookieConsentModule.forRoot(cookieConsentConfig),
    ),
    provideRouter(
      AppRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      // withDebugTracing()
    ),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withInterceptors([OrganizationInterceptor, LogInterceptor, ErrorInterceptor, CacheInterceptor])),
    makeEnvironmentProviders([
      {
        provide: APP_INITIALIZER,
        useFactory: appInitializerFactory,
        deps: [TranslateService, EnvironmentService],
        multi: true,
      },
    ]),
    provideFeatureFlags(),
    CacheRepository,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
    { provide: VALIDATION_ERRORS_TOKEN, useValue: { validationErrors } },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    MsalService,
  ],
};
