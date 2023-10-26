import { NgOptimizedImage } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FiyuMenuItem, FiyuTourService, ModuleMetadataInterface, SharedTranslateKeys } from '@fiyu/api';
import { BreadcrumbService, EnvironmentService, MenuService, NotificationsService } from '@fiyu/core';
import { DialogComponent, FiyuTemplateDirective, ISidebarMenu } from '@fiyu/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ModuleMetadata } from './../module-metadata';

@Component({
  selector: 'fiyu-frontend-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, ButtonModule, TranslateModule, FiyuTemplateDirective, DialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceComponent implements OnInit, AfterViewInit, ISidebarMenu {
  public moduleMetadata: ModuleMetadataInterface;
  public menuItems: FiyuMenuItem[];
  public sharedTranslateKeys = SharedTranslateKeys;
  private readonly environmentService: EnvironmentService = inject(EnvironmentService);
  private readonly breadcrumbService: BreadcrumbService = inject(BreadcrumbService);
  private readonly menuService: MenuService = inject(MenuService);
  private readonly notificationsService: NotificationsService = inject(NotificationsService);
  private readonly fiyuTourService: FiyuTourService = inject(FiyuTourService);
  @Output() closeDialogEmitter: EventEmitter<void> = new EventEmitter();

  constructor() {
    this.moduleMetadata = ModuleMetadata.getInstance();
    this.menuItems = ModuleMetadata.getInstance().menuItems;
  }

  ngOnInit() {
    this.menuService.setMenuItems(this.menuItems);
    this.breadcrumbService.setItems([{ label: this.moduleMetadata.moduleName, routerLink: ['/'] }]);
  }

  ngAfterViewInit(): void {
    if (this.environmentService.production) this.fiyuTourService.startFIYUTour();
  }

  // Gets permission status from notification service
  getNotificationPermissionStatus(): string {
    return this.notificationsService.getPermissionStatus();
  }

  // Requests permission from notification service
  requestPermission() {
    this.notificationsService.requestPermission();
  }

  // If notification permission status is default, dialog should be displayed to inform user to enable notifications
  displayDialog(): boolean {
    return (
      this.notificationsService.isSupported() &&
      !this.notificationsService.isMobileDevice() &&
      this.getNotificationPermissionStatus() === 'default'
    );
  }
}
