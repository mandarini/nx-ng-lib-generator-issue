import { AsyncPipe, NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import {
  ColorScheme,
  InputStyle,
  MenuMode,
  ModulePrefixes,
  SharedTranslateKeys,
  THEME_CONFIG_TOKEN,
  ThemeConfig,
  WINDOW,
} from '@fiyu/api';
import { BreadcrumbService, FeedbackService, MenuService, NotificationsService } from '@fiyu/core';
import {
  ConfirmDialogComponent,
  DialogComponent,
  FeedbackBarComponent,
  FeedbackSnackBarComponent,
  FeedbackToastComponent,
  FiyuTemplateDirective,
} from '@fiyu/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { AppFooterComponent } from './../../layout/footer/app.footer.component';
import { AppTopBarComponent } from './../../layout/topbar/app.topbar.component';

@Component({
  selector: 'app-main',
  templateUrl: './app.main.component.html',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgClass,
    NgOptimizedImage,
    RouterOutlet,
    ToastModule,
    ButtonModule,
    ConfirmDialogComponent,
    FeedbackBarComponent,
    FeedbackSnackBarComponent,
    FeedbackToastComponent,
    DialogComponent,
    AppTopBarComponent,
    AppFooterComponent,
    FiyuTemplateDirective,
    TranslateModule,
  ],
})
export class AppMainComponent implements OnInit, AfterViewInit {
  public readonly themeConfig$: Observable<ThemeConfig> = inject(THEME_CONFIG_TOKEN);
  themeConfig: ThemeConfig;
  items: MenuItem[];
  overlayMenuActive: boolean;
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
  menuClick: boolean;
  search: boolean = false;
  searchClick: boolean = false;
  userMenuClick: boolean;
  topbarUserMenuActive: boolean;
  organizationMenuClick: boolean;
  topbarOrganizationMenuActive: boolean;
  notificationMenuClick: boolean;
  topbarNotificationMenuActive: boolean;
  rightMenuClick: boolean;
  rightMenuActive: boolean;
  configActive: boolean;
  configClick: boolean;
  resetMenu: boolean;
  menuHoverActive: boolean = false;
  displayDialog: boolean = false;
  ripple: boolean = true;
  sharedTranslateKeys = SharedTranslateKeys;
  colorScheme = ColorScheme;
  menuMode = MenuMode;
  inputStyle = InputStyle;
  public primengConfig: PrimeNGConfig = inject(PrimeNGConfig);
  private readonly menuService: MenuService = inject(MenuService);
  private readonly breadcrumbService: BreadcrumbService = inject(BreadcrumbService);
  private readonly feedbackService: FeedbackService = inject(FeedbackService);
  private readonly router: Router = inject(Router);
  private readonly notificationsService: NotificationsService = inject(NotificationsService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly window: Window = inject(WINDOW);

  ngOnInit(): void {
    this.breadcrumbService.itemsHandler.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((response) => {
      this.items = response;
    });
    this.themeConfig$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.themeConfig = data;
    });
    // triggering method for checking if notifications are blocked
    this.getNotificationPermissionStatus();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.layoutMenuScrollerViewChild.moveBar();
      // checking if notifications are blocked
      if (
        this.notificationsService.isSupported() &&
        !this.notificationsService.isMobileDevice() &&
        this.notificationsService.getPermissionStatus() === 'denied'
      ) {
        this.feedbackService.warningBarMessage('Enable notifications', true);
      }
    }, 100);
  }

  onLayoutClick(): void {
    if (!this.searchClick) {
      this.search = false;
    }
    if (!this.userMenuClick) {
      this.topbarUserMenuActive = false;
    }
    if (!this.notificationMenuClick) {
      this.topbarNotificationMenuActive = false;
    }
    if (!this.organizationMenuClick) {
      this.topbarOrganizationMenuActive = false;
    }
    if (!this.rightMenuClick) {
      this.rightMenuActive = false;
    }
    if (!this.menuClick) {
      if (this.isSlim() || this.isHorizontal()) {
        this.menuService.reset();
      }
      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      this.menuHoverActive = false;
      this.unblockBodyScroll();
    }
    if (this.configActive && !this.configClick) {
      this.configActive = false;
    }
    this.searchClick = false;
    this.configClick = false;
    this.userMenuClick = false;
    this.rightMenuClick = false;
    this.notificationMenuClick = false;
    this.organizationMenuClick = false;
    this.menuClick = false;
  }

  onMenuButtonClick(event: any): void {
    this.menuClick = true;
    this.topbarUserMenuActive = false;
    this.topbarNotificationMenuActive = false;
    this.topbarOrganizationMenuActive = false;
    this.rightMenuActive = false;
    if (this.isOverlay()) {
      this.overlayMenuActive = !this.overlayMenuActive;
    }
    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive;
      if (this.staticMenuMobileActive) {
        this.blockBodyScroll();
      } else {
        this.unblockBodyScroll();
      }
    }
    event.preventDefault();
  }

  onSearchClick(): void {
    this.search = !this.search;
    this.searchClick = !this.searchClick;
  }

  onSearchHide(): void {
    this.search = false;
    this.searchClick = false;
  }

  onMenuClick(): void {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onTopbarUserMenuButtonClick(event: any): void {
    this.userMenuClick = true;
    this.topbarUserMenuActive = !this.topbarUserMenuActive;
    this.hideOverlayMenu();
    event.preventDefault();
  }

  onTopbarOrganizationMenuButtonClick(event: any): void {
    this.organizationMenuClick = true;
    this.topbarOrganizationMenuActive = !this.topbarOrganizationMenuActive;
    this.hideOverlayMenu();
    event.preventDefault();
  }

  onTopbarNotificationMenuButtonClick(event: any): void {
    this.notificationMenuClick = true;
    this.topbarNotificationMenuActive = !this.topbarNotificationMenuActive;
    this.hideOverlayMenu();
    event.preventDefault();
  }

  onRightMenuClick(event: any): void {
    this.rightMenuClick = true;
    this.rightMenuActive = !this.rightMenuActive;
    this.hideOverlayMenu();
    event.preventDefault();
  }

  onRippleChange(event: any): void {
    this.ripple = event.checked;
    this.primengConfig = event.checked;
  }

  onConfigClick(): void {
    this.configClick = true;
  }

  isSlim(): boolean {
    return this.themeConfig.menuMode === MenuMode.Slim;
  }

  isHorizontal(): boolean {
    return this.themeConfig.menuMode === MenuMode.Horizontal;
  }

  isOverlay(): boolean {
    return this.themeConfig.menuMode === MenuMode.Overlay;
  }

  isDesktop(): boolean {
    return this.window.innerWidth > 1091;
  }

  isMobile(): boolean {
    return this.window.innerWidth <= 1091;
  }

  hideOverlayMenu(): void {
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(
        new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' ',
      );
    }
  }

  navigateToNmmNotifications(): void {
    this.router.navigateByUrl(`/${ModulePrefixes.NOTIFICATIONS}/notifications`);
  }

  // Enable notification logic
  // Gets permission status from notification service
  getNotificationPermissionStatus(): string {
    return this.notificationsService.getPermissionStatus();
  }

  // Opens dialog box
  openInstructionsDialog(): boolean {
    return this.notificationsService.isSupported() && !this.notificationsService.isMobileDevice();
  }

  // Closes dialog box
  hideInstructionsDialog(): void {
    this.displayDialog = false;
  }
}
