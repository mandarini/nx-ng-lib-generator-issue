import {
  FiyuMenuItem,
  ModuleAliases,
  ModuleMetadataInterface,
  ModulePrefixes,
  Operations,
  Permissions,
  SharedTranslateKeys,
} from '@fiyu/api';
import { AbstractModuleMetadata } from '@fiyu/core';
import { ModulePermissions } from './module-permissions';

/**
 * Class with metadata for module
 */
export class ModuleMetadata extends AbstractModuleMetadata implements ModuleMetadataInterface {
  /**
   * Is module local module only, server doesn't know about it
   */
  public isLocal = true;
  /**
   * Module name
   */
  public moduleName = SharedTranslateKeys.Workspace;

  /**
   * Short name
   */
  public moduleNameShort = 'WS';

  /**
   * Module description
   */
  public moduleDescription = '';

  /**
   *  Module prefix used in navigation and url
   */
  public modulePrefix = '';

  /**
   *  Module icon
   */
  public moduleIcon = 'pi pi-fw pi-th-large';

  /**
   *  Module prefix used in navigation and url
   */
  public moduleLogoColor = '#6fa21d';

  /**
   *  Module darker color
   */
  public moduleLogoDarkerColor = '#618e18';

  /**
   * Module name used for accessing user module permissions
   */
  public moduleAlias = ModuleAliases.WORKSPACE;

  /**
   * All possible permissions for this module
   */
  public modulePermissions = ModulePermissions;

  /**
   * Sidebar permissions
   */
  public platformPermissions: Permissions = {
    requiredPermissions: [ModulePermissions.PLATFORM_RUN],
    operation: Operations.OR,
  };
  public organizationPermissions: Permissions = {
    requiredPermissions: [ModulePermissions.ORGANIZATION_RUN],
    operation: Operations.OR,
  };

  public usersPermissions: Permissions = {
    requiredPermissions: [ModulePermissions.USER_RUN],
    operation: Operations.OR,
  };
  public dmmPermissions: Permissions = {
    requiredPermissions: [ModulePermissions.DMM_RUN],
    operation: Operations.OR,
  };
  public nmmPermissions: Permissions = {
    requiredPermissions: [ModulePermissions.NMM_RUN],
    operation: Operations.OR,
  };

  public crmPermissions: Permissions = {
    requiredPermissions: [ModulePermissions.CRM_RUN],
    operation: Operations.OR,
  };
  public jankecPermissions: Permissions = {
    requiredPermissions: [ModulePermissions.JANKEC_RUN],
    operation: Operations.OR,
  };

  /**
   * Module sidebar navigation
   */
  public menuItems: FiyuMenuItem[] = [
    {
      label: SharedTranslateKeys.BusinessModules,
      icon: 'pi pi-fw pi-th-large',
      items: [
        {
          id: 'frontend-docs',
          label: SharedTranslateKeys.FrontendDocs,
          icon: 'pi pi-fw pi-book',
          routerLink: '/documentation',
          permissions: this.platformPermissions,
          moduleAlias: ModuleAliases.PLATFORM,
        },
        {
          id: 'backend-docs',
          label: SharedTranslateKeys.BackendDocs,
          icon: 'pi pi-fw pi-book',
          routerLink: '/be-documentation',
          permissions: this.platformPermissions,
          moduleAlias: ModuleAliases.PLATFORM,
        },
        {
          id: 'crm',
          label: 'CRM',
          icon: 'pi pi-fw pi-box',
          routerLink: '/crm',
          permissions: this.crmPermissions,
          moduleAlias: ModuleAliases.CRM,
        },
        {
          label: 'JANKEC',
          icon: 'pi pi-fw pi-book',
          routerLink: '/jankec',
          permissions: this.jankecPermissions,
          moduleAlias: 'JANKEC',
        },
      ],
    },
    { separator: true },
    {
      label: SharedTranslateKeys.CoreModules,
      icon: 'pi pi-fw pi-th-large',
      items: [
        {
          id: ModulePrefixes.PLATFORM,
          label: SharedTranslateKeys.Platform,
          icon: 'pi pi-fw pi-cog',
          routerLink: `/${ModulePrefixes.PLATFORM}`,
          permissions: this.platformPermissions,
          moduleAlias: ModuleAliases.PLATFORM,
        },
        {
          id: ModulePrefixes.ORGANIZATION,
          label: SharedTranslateKeys.Organization,
          icon: 'pi pi-fw pi-briefcase',
          routerLink: `/${ModulePrefixes.ORGANIZATION}`,
          permissions: this.organizationPermissions,
          moduleAlias: ModuleAliases.ORGANIZATION,
        },
        {
          id: 'users',
          label: SharedTranslateKeys.Users,
          icon: 'pi pi-fw pi-users',
          routerLink: `/${ModulePrefixes.USER}`,
          permissions: this.usersPermissions,
          moduleAlias: ModuleAliases.USER,
        },
        {
          id: 'notifications',
          label: SharedTranslateKeys.Notifications,
          icon: 'pi pi-fw pi-bell',
          routerLink: `/${ModulePrefixes.NOTIFICATIONS}`,
          permissions: this.nmmPermissions,
          moduleAlias: ModuleAliases.NOTIFICATIONS,
        },
        {
          id: 'documents',
          label: SharedTranslateKeys.Documents,
          icon: 'pi pi-fw pi-images',
          routerLink: `/${ModulePrefixes.DOCUMENTS}`,
          permissions: this.dmmPermissions,
          moduleAlias: ModuleAliases.DOCUMENTS,
        },
      ],
    },
    { separator: true },
    {
      label: SharedTranslateKeys.Info,
      icon: 'pi pi-fw pi-circle',
      items: [
        {
          id: 'docs',
          label: SharedTranslateKeys.Documentation,
          icon: 'pi pi-fw pi-book',
          url: 'https://docs.fiyu.online',
          target: '_blank',
        },
        {
          id: 'microtica',
          label: 'Microtica',
          icon: 'pi pi-fw pi-server',
          url: 'https://portal.microtica.com',
          target: '_blank',
        },
        {
          id: 'gitlab',
          label: 'Gitlab',
          icon: 'pi pi-fw pi-github',
          url: 'https://gitlab.fiyu.online/jankec',
          target: '_blank',
        },
        {
          id: 'about-us',
          label: SharedTranslateKeys.About,
          icon: 'pi pi-fw pi-info-circle',
          url: 'https://www.fiyu.app',
          target: '_blank',
        },
      ],
    },
  ];
}
