import { AsyncPipe, NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FiyuMenuItem, ModuleAliases, ModuleMetadataInterface } from '@fiyu/api';
import { DownloadedFile, LogoService, MenuService, OrganizationChangeService } from '@fiyu/core';
import { ModuleMetadata as CrmModuleMetadata } from '@fiyu/crm';
import { ModuleMetadata as DocumentsModuleMetadata } from '@fiyu/documents';
import { ModuleMetadata as NotificationsModuleMetadata } from '@fiyu/notifications';
import { ModuleMetadata as OrganizationModuleMetadata } from '@fiyu/organizations';
import { ModuleMetadata as PlatformModuleMetadata } from '@fiyu/platform';
import { ModuleMetadata as JankecModuleMetadata } from '@nas/jankec';
import { HasPermissionsDirective, NgForTrackByPropDirective } from '@fiyu/ui';
import { ModuleMetadata as UsersModuleMetadata } from '@fiyu/users';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { ModuleMetadata as WorkspaceModuleMetadata } from '../../workspace/module-metadata';
import { AppMainComponent } from '../main/app.main.component';
import { AppMenuitemComponent } from './../../layout/menu/app.menuitem.component';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    RouterLink,
    NgOptimizedImage,
    AsyncPipe,
    HasPermissionsDirective,
    NgForTrackByPropDirective,
    TranslateModule,
    AppMenuitemComponent,
  ],
})
export class AppMenuComponent implements OnInit, AfterViewInit {
  public coreModules: ModuleMetadataInterface[] = [];
  public menuItems$: Observable<FiyuMenuItem[]>;
  public operation = 'OR';
  public appMain: AppMainComponent = inject(AppMainComponent);
  private readonly menuService: MenuService = inject(MenuService);
  private readonly elRef: ElementRef = inject(ElementRef);
  private readonly organizationChangeService: OrganizationChangeService = inject(OrganizationChangeService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly logoService: LogoService = inject(LogoService);
  public readonly logo: Signal<DownloadedFile> = this.logoService.state;

  ngOnInit() {
    this.coreModules.push(
      WorkspaceModuleMetadata.getInstance(),
      UsersModuleMetadata.getInstance(),
      NotificationsModuleMetadata.getInstance(),
      OrganizationModuleMetadata.getInstance(),
      PlatformModuleMetadata.getInstance(),
      DocumentsModuleMetadata.getInstance(),
      CrmModuleMetadata.getInstance(),
      JankecModuleMetadata.getInstance(),
    );
    this.menuItems$ = this.menuService.menuItemsSource$;

    this.organizationChangeService.organizationChange$
      .pipe(
        filter((value: unknown) => value !== null),
        delay(1000),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.hideEmptyMenuSection();
      });
  }

  ngAfterViewInit() {
    this.hideEmptyMenuSection();
  }

  public goToModule(): void {
    setTimeout(() => {
      this.hideEmptyMenuSection();
    }, 1000);
  }

  private hideEmptyMenuSection() {
    const menu = this.elRef.nativeElement.querySelectorAll('ul[role="menu"]');
    // console.log('menu', menu);
    menu.forEach((element: HTMLElement) => {
      if (element?.childElementCount === 0) {
        element?.parentElement.classList.add('hidden-menu');
      }
    });
  }

  public getModulePermissions(module: ModuleMetadataInterface): Array<string> {
    if (module?.moduleAlias === ModuleAliases.WORKSPACE) {
      return Object.values(module.modulePermissions);
    } else {
      return Array.of(`${module?.moduleAlias}_RUN`);
    }
  }

  public getModuleAlias(moduleAlias: string): string {
    if (moduleAlias === ModuleAliases.WORKSPACE) {
      return null;
    }
    return moduleAlias;
  }
}
