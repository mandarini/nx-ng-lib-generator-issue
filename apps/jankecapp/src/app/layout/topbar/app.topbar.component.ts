import { AsyncPipe, NgClass, NgFor, NgForOf, NgIf, NgOptimizedImage, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LC_ACTIVE_ORGANIZATION_ID,
  LC_LANG,
  ModuleAliases,
  ModuleMetadataInterface,
  ProfileOrganization,
  SharedTranslateKeys,
} from '@fiyu/api';
import {
  ArrayUtil,
  BreadcrumbService,
  CoreService,
  DownloadedFile,
  FilesService,
  FiyuNotification,
  FiyuNotificationData,
  MenuService,
  NotificationsService,
  OrganizationChangeService,
  RendererHelper,
  SecurityService,
  SortDirection,
  StorageService,
} from '@fiyu/core';
import { NotificationMessages, NotificationMessagesService } from '@fiyu/notifications';
import { HasPermissionsDirective } from '@fiyu/ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { combineLatest, firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppMainComponent } from '../main/app.main.component';
import { AppMenuComponent } from './../../layout/menu/app.menu.component';
import { ModuleMetadata as WorkspaceModuleMetadata } from './../../workspace/module-metadata';

export type OrganizationMenuModuleItem = {
  label: string;
  color: string;
  selected: boolean;
  routerLink: string;
  alias: string;
  icon: string;
  visible: boolean;
};
export type OrganizationMenuItemValue = {
  id: string;
  name: string;
  modules: OrganizationMenuModuleItem[];
};
export type OrganizationMenuItem = {
  label: string;
  value: OrganizationMenuItemValue;
};

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgForOf,
    NgClass,
    NgStyle,
    AsyncPipe,
    RouterLink,
    NgOptimizedImage,
    ReactiveFormsModule,
    DropdownModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    TranslateModule,
    HasPermissionsDirective,
    AppMenuComponent,
  ],
})
export class AppTopBarComponent implements OnInit {
  public appMain: AppMainComponent = inject(AppMainComponent);
  public sharedTranslateKeys = SharedTranslateKeys;
  public moduleAliases = ModuleAliases;
  public items$: Observable<MenuItem[] | undefined>;
  public profileImage$: Observable<DownloadedFile> = of({
    file: null,
    base64ImageString: '',
    blob: null,
  });
  tieredItems: MenuItem[] | undefined = [];
  organizations: OrganizationMenuItem[] = [];
  notificationMessages: Partial<NotificationMessages>[] = [];
  notificationMessagesUnseen = 0;
  selectedOrganization: OrganizationMenuItemValue;
  userFullName = 'John Doe';
  userInitials = 'JD';
  userOrganizationsWithModules$: Observable<[Map<string, ModuleMetadataInterface[]>, ProfileOrganization[]]>;
  public languageSwitcher = new FormControl<string>(localStorage.getItem(LC_LANG) ?? 'en');
  public languageOptions: SelectItem[] = [
    { label: 'en', value: 'en', icon: 'gb' },
    { label: 'hr', value: 'hr', icon: 'hr' },
    { label: 'de', value: 'de', icon: 'de' },
  ];
  private readonly translateService = inject(TranslateService);
  private readonly filesService = inject(FilesService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly router: Router = inject(Router);
  private readonly secService: SecurityService = inject(SecurityService);
  private readonly coreService: CoreService = inject(CoreService);
  private readonly storageService: StorageService = inject(StorageService);
  private readonly notificationService: NotificationsService = inject(NotificationsService);
  private readonly notificationMessagesService: NotificationMessagesService = inject(NotificationMessagesService);
  private readonly menuService: MenuService = inject(MenuService);
  private readonly organizationChangeService: OrganizationChangeService = inject(OrganizationChangeService);
  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit() {
    this.items$ = this.breadcrumbService.itemsHandler;
    this.languageSwitcher.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (option: string) => this.useLanguage(option),
    });
    this.languageSwitcher.setValue(localStorage.getItem(LC_LANG) ?? 'en');
    this.subscribeToMessages();
  }

  private setTopBarItems() {
    const user = this.coreService.getUser();

    if (user) {
      this.userFullName = `${user.firstName} ${user.lastName}`;
      this.userInitials = RendererHelper.getInitials(this.userFullName);
      this.profileImage$ = this.downloadFile(user.imageId).pipe(
        catchError(() => of({ file: null, base64ImageString: '', blob: null })),
      );
    }
    this.organizations = [];
    const userOrganizations$ = this.coreService.getUserOrganizationsSource();
    const userOrganizationsWithModules$ = this.coreService.getUserOrganizationsWithModulesSource();

    this.userOrganizationsWithModules$ = combineLatest([userOrganizationsWithModules$, userOrganizations$]).pipe(
      tap(([orgModules, orgs]) => {
        this.organizations = [];
        orgModules.forEach((modules: ModuleMetadataInterface[], organization: string) => {
          const org: ProfileOrganization = orgs.find((elem: ProfileOrganization) => {
            return elem.id === organization;
          });
          const o: OrganizationMenuItem = {
            label: org.name,
            value: {
              id: organization,
              name: org.name,
              modules: this.mapTopbarModuleInfo(modules),
            },
          };
          this.organizations.push(o);
        });
        const organization = this.organizations.find(
          (org) => org.value.id === this.storageService.getItem(LC_ACTIVE_ORGANIZATION_ID),
        );
        this.selectedOrganization = organization ? organization.value : this.organizations[0].value;
        this.coreService.setCurrentOrganization(this.selectedOrganization.id);
        if (user) {
          this.organizations.sort(ArrayUtil.sortByKey('label', SortDirection.Ascending));
          const organizationMenuItems: {
            label: string;
            items: unknown[];
          }[] = [
            {
              label: `${this.selectedOrganization.name}`,
              items: [
                ...ArrayUtil.arrayFlatDeep(this.selectedOrganization.modules),
                {
                  separator: true,
                },
                {
                  label: this.translateService.instant(this.sharedTranslateKeys.SwitchOrganization),
                  items: [
                    ...ArrayUtil.arrayFlatDeep(
                      this.organizations.map((data) => {
                        return {
                          label: data.label,
                          command: () => {
                            this.organizationChange(data);
                          },
                        };
                      }),
                    ),
                  ],
                },
              ],
            },
          ];
          this.tieredItems = [...organizationMenuItems];
        } else {
          this.redirectToWorkspace();
        }
      }),
    );
  }

  setAllSeen() {
    const idToBeMarkedSeen: string[] = [];
    this.notificationMessages = this.notificationMessages.map((item) => {
      if (!item.seen) {
        item.seen = true;
        idToBeMarkedSeen.push(item.id);
      }
      return item;
    });
    this.notificationMessagesUnseen -= idToBeMarkedSeen.length;
    this.notificationMessagesService.markSeen(idToBeMarkedSeen);
  }

  /* read notification */
  readNotification(id: string) {
    const messages = this.notificationMessages.map((item) => {
      if (item.id === id) {
        item.read = true;
        // Endpoint has to receive a list of ids as input
        this.notificationMessagesService.markRead([id]);
      }
      return item;
    });
    this.notificationMessages = messages;
  }

  subscribeToMessages() {
    this.notificationService
      .subscribeToMessages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message: FiyuNotification) => {
        if (message && message.data) {
          // const msg: FiyuNotificationData = message.data;
          const msg: FiyuNotificationData = JSON.parse((<any>message.data)['gcm.notification.data']);
          const moduleMetaData = this.coreService.getModuleInfoByName(msg.generator);

          /* remove last notification and add new to the start of the array */
          if (this.notificationMessages.length === 10) {
            this.notificationMessages.pop();
          }
          msg.read = msg.read ?? false;
          msg.seen = msg.seen ?? false;
          msg.icon = moduleMetaData.moduleIcon;
          msg.color = moduleMetaData.moduleLogoColor;

          this.notificationMessages.unshift(msg);
          this.notificationMessagesUnseen++;
        }
      });
  }

  mapTopbarModuleInfo(modules: ModuleMetadataInterface[]): OrganizationMenuModuleItem[] {
    const topbarModules: OrganizationMenuModuleItem[] = [];
    modules.forEach((module) => {
      const moduleRunPermission = `${module?.moduleAlias}_RUN`;
      let hasModulePermission = false;
      try {
        hasModulePermission = this.coreService.hasPermission(moduleRunPermission, module?.moduleAlias);
      } catch (error) {
        hasModulePermission = false;
      }

      const topbarModule: OrganizationMenuModuleItem = {
        label: this.translateService.instant(module.moduleName),
        color: module.moduleLogoColor,
        selected: false,
        routerLink: `/${module.modulePrefix}`,
        alias: module.moduleAlias,
        icon: module.moduleIcon,
        visible: hasModulePermission,
      };
      topbarModules.push(topbarModule);
    });
    return topbarModules;
  }

  viewAllNotifications() {
    setTimeout(() => {
      this.appMain.topbarUserMenuActive = false;
    }, 0);
    this.appMain.navigateToNmmNotifications();
  }

  redirectToWorkspace() {
    this.router.navigateByUrl('/');
  }

  logout() {
    this.secService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigateByUrl('/login');
      });
  }

  organizationChange(data: OrganizationMenuItem) {
    const organizationDataFromApp = {
      id: data.value.id,
      name: data.value.name,
      modules: data.value.modules,
    };
    if (data.value.id !== this.selectedOrganization.id) {
      this.redirectToWorkspace();
    }
    const defaultMenuItems = WorkspaceModuleMetadata.getInstance().menuItems;
    this.menuService.setMenuItems(null);
    this.cd.detectChanges();
    this.menuService.setMenuItems(defaultMenuItems);
    this.selectedOrganization = organizationDataFromApp;
    this.coreService.setCurrentOrganization(this.selectedOrganization.id);
    this.setTopBarItems();
    this.organizationChangeService.triggerOrganizationChange(true);
  }

  downloadFile(fileUuid: string): Observable<DownloadedFile> {
    if (!fileUuid) {
      return of(null);
    }
    return this.filesService.downloadFile(fileUuid).pipe(
      switchMap((blob: Blob) =>
        this.filesService.blobToBase64(blob).pipe(map((base64ImageString) => ({ base64ImageString, blob }))),
      ),
      map((response) => {
        const file = new File([response.blob], fileUuid, { type: response.blob.type });
        return { ...response, file } as DownloadedFile;
      }),
      catchError(() => of(null)),
    );
  }

  useLanguage(language: string): void {
    localStorage.setItem(LC_LANG, language);
    //this.translate.resetLang(language);
    this.translateService
      .use(language)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async () => {
          await this.preloadTranslations();
          this.setTopBarItems();
        },
      });
    //  this.cd.detectChanges();
  }

  async preloadTranslations(): Promise<unknown> {
    // It loads the translate data now, and you can now safely use instant
    const preloadedTranslations = await firstValueFrom(
      this.translateService.getTranslation(this.languageSwitcher.value),
    );
    return preloadedTranslations;
  }
}
