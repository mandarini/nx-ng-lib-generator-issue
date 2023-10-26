import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DataLayerService, EnvironmentService } from '@fiyu/core';
import { TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { PrimeNGConfig } from 'primeng/api';
import { filter } from 'rxjs';

@Component({
  selector: 'fiyu-frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly environmentService: EnvironmentService = inject(EnvironmentService);
  private readonly primengConfig: PrimeNGConfig = inject(PrimeNGConfig);
  private readonly ccService: NgcCookieConsentService = inject(NgcCookieConsentService);
  private readonly dataLayerService: DataLayerService = inject(DataLayerService);

  ngOnInit() {
    this.primengConfig.ripple = true;
    if (this.environmentService.production) {
      this.setCookieTranslations();
    }
    this.triggerRouterEvents();
  }
  private triggerRouterEvents() {
    this.router.events
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filter((event: any) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event: NavigationEnd) => {
        /*   if (this.appMain.isSlim() || this.appMain.isHorizontal()) {
          this.active = false;
        } else if (this.item.routerLink) {
          this.updateActiveStateFromRoute();
        } else {
          this.active = false;
        } */
        /** START : Code to Track Page View using GTM */
        if (this.environmentService.production) {
          const gtmTag = {
            event: 'page',
            pageName: event.urlAfterRedirects,
            data: 'Page View',
          };
          this.dataLayerService.logPageView(gtmTag);
        }
        /** END : Code to Track Page View using GTM */
      });
  }

  setCookieTranslations() {
    this.translateService
      .get([
        'cookie.header',
        'cookie.message',
        'cookie.dismiss',
        'cookie.allow',
        'cookie.deny',
        'cookie.link',
        'cookie.policy',
      ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.ccService.getConfig().content = this.ccService.getConfig().content || {};
        // Override default messages with the translated ones
        this.ccService.getConfig().content.header = data['cookie.header'];
        this.ccService.getConfig().content.message = data['cookie.message'];
        this.ccService.getConfig().content.dismiss = data['cookie.dismiss'];
        this.ccService.getConfig().content.allow = data['cookie.allow'];
        this.ccService.getConfig().content.deny = data['cookie.deny'];
        this.ccService.getConfig().content.link = data['cookie.link'];
        this.ccService.getConfig().content.policy = data['cookie.policy'];
        this.ccService.destroy(); // remove previous cookie bar (with default messages)
        this.ccService.init(this.ccService.getConfig()); // update config with translated messages
      });
  }
}
