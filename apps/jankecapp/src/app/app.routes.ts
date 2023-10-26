import { ModulePrefixes, RequiredModulesConfig, SharedTranslateKeys } from '@fiyu/api';
import { ActivationGuard, AuthGuard, FiyuRoutes, loadScriptResolver, PermissionsMatchGuard } from '@fiyu/core';
import { ModulePermissions } from './workspace/module-permissions';

const appChildRoutes: FiyuRoutes = [
  {
    path: 'documentation',
    title: SharedTranslateKeys.Documentation,
    loadComponent: () => import('./documentation/documentation.component').then((c) => c.DocumentationComponent),
  },
  {
    path: 'be-documentation',
    title: SharedTranslateKeys.Documentation,
    loadComponent: () =>
      import('./documentation/documentation-backend.component').then((c) => c.DocumentationBackendComponent),
  },
  {
    path: ModulePrefixes.PLATFORM,
    title: SharedTranslateKeys.Platform,
    loadChildren: () => import(`@fiyu/platform`).then((r) => r.PlatformRoutes),
    canMatch: [ActivationGuard, PermissionsMatchGuard],
    requiredModule: RequiredModulesConfig.PLATFORM,
    requiredPermissions: [ModulePermissions.PLATFORM_RUN],
  },
  {
    path: ModulePrefixes.CRM,
    title: 'CRM',
    loadChildren: () => import(`@fiyu/crm`).then((r) => r.CrmRoutes),
    canMatch: [ActivationGuard, PermissionsMatchGuard],
    requiredModule: RequiredModulesConfig.CRM,
    requiredPermissions: [ModulePermissions.CRM_RUN],
  },
  {
    path: ModulePrefixes.USER,
    title: SharedTranslateKeys.Users,
    loadChildren: () => import(`@fiyu/users`).then((r) => r.UsersRoutes),
    canMatch: [ActivationGuard, PermissionsMatchGuard],
    requiredModule: RequiredModulesConfig.USER,
    requiredPermissions: [ModulePermissions.USER_RUN],
  },
  {
    path: ModulePrefixes.ORGANIZATION,
    title: SharedTranslateKeys.Organizations,
    loadChildren: () => import(`@fiyu/organizations`).then((r) => r.OrganizationsRoutes),
    canMatch: [ActivationGuard, PermissionsMatchGuard],
    requiredModule: RequiredModulesConfig.ORGANIZATION,
    requiredPermissions: [ModulePermissions.ORGANIZATION_RUN],
  },
  {
    path: ModulePrefixes.NOTIFICATIONS,
    title: SharedTranslateKeys.Notifications,
    loadChildren: () => import('@fiyu/notifications').then((r) => r.NotificationsRoutes),
    canMatch: [ActivationGuard, PermissionsMatchGuard],
    requiredModule: RequiredModulesConfig.NOTIFICATIONS,
    requiredPermissions: [ModulePermissions.NMM_RUN],
  },
  {
    path: ModulePrefixes.DOCUMENTS,
    title: SharedTranslateKeys.Documents,
    loadChildren: () => import('@fiyu/documents').then((r) => r.DocumentsRoutes),
    canMatch: [ActivationGuard, PermissionsMatchGuard],
    requiredModule: RequiredModulesConfig.DOCUMENTS,
    requiredPermissions: [ModulePermissions.DMM_RUN],
  },
  {
    path: 'jankec',
    title: 'JANKEC',
    loadChildren: () => import(`@nas/jankec`).then((r) => r.JankecRoutes),
    canMatch: [ActivationGuard, PermissionsMatchGuard],
    requiredModule: 'jankec',
    requiredPermissions: [ModulePermissions.JANKEC_RUN],
  },
  {
    path: '',
    title: SharedTranslateKeys.Workspace,
    loadComponent: () => import('./workspace/workspace/workspace.component').then((c) => c.WorkspaceComponent),
  },
];

export const AppRoutes: FiyuRoutes = [
  {
    path: '',
    loadComponent: () => import('./layout/main/app.main.component').then((c) => c.AppMainComponent),
    children: appChildRoutes,
    canActivate: [AuthGuard],
    data: { scriptName: 'exceljs' },
    resolve: { loadScript: loadScriptResolver },
  },
  {
    path: 'login',
    title: SharedTranslateKeys.Login,
    loadComponent: () => import('./account/login/app.login.component').then((c) => c.AppLoginComponent),
  },
  {
    path: 'forgot-password',
    title: SharedTranslateKeys.ForgotPasswordTitle,
    loadComponent: () =>
      import('./account/forgot-password-form/forgot-password-form.component').then(
        (c) => c.ForgotPasswordFormComponent,
      ),
  },
  {
    path: 'reset-password',
    title: SharedTranslateKeys.ResetPasswordTitle,
    loadComponent: () =>
      import('./account/reset-password-form/reset-password-form.component').then((c) => c.ResetPasswordFormComponent),
  },
  {
    path: 'not-found',
    title: 'Not found',
    loadComponent: () => import('./layout/not-found/not-found.component').then((c) => c.NotFoundComponent),
  },
  {
    path: 'not-authorized',
    title: 'Not authorized',
    loadComponent: () =>
      import('./layout/not-authorized/not-authorized.component').then((c) => c.NotAuthorizedComponent),
  },
  { path: '**', redirectTo: '/not-found' },
];
