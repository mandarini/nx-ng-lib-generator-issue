import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FiyuMenuItem } from '@fiyu/api';
import { MenuService } from '@fiyu/core';
import { HasPermissionsDirective } from '@fiyu/ui';
import { TranslateModule } from '@ngx-translate/core';
import { AppMainComponent } from './../main/app.main.component';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const gtag: Function;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-menuitem]',
  templateUrl: './app.menuitem.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgForOf, NgClass, RouterLink, RouterLinkActive, TranslateModule, HasPermissionsDirective],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.layout-root-menuitem]': 'root',
    '[class.active-menuitem]': '(active && !root) || (active && (appMain.isSlim() || appMain.isHorizontal()))',
  },
  animations: [
    trigger('children', [
      state(
        'void',
        style({
          height: '0px',
        }),
      ),
      state(
        'hiddenAnimated',
        style({
          height: '0px',
        }),
      ),
      state(
        'visibleAnimated',
        style({
          height: '*',
        }),
      ),
      state(
        'visible',
        style({
          height: '*',
          'z-index': 100,
        }),
      ),
      state(
        'hidden',
        style({
          height: '0px',
          'z-index': '*',
        }),
      ),
      state(
        'slimVisibleAnimated',
        style({
          opacity: 1,
          transform: 'none',
        }),
      ),
      state(
        'slimHiddenAnimated',
        style({
          opacity: 0,
          transform: 'translateX(20px)',
        }),
      ),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => visibleAnimated, visibleAnimated => void', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => slimVisibleAnimated', animate('400ms cubic-bezier(.05,.74,.2,.99)')),
      transition('slimHiddenAnimated => slimVisibleAnimated', animate('400ms cubic-bezier(.05,.74,.2,.99)')),
    ]),
  ],
})
export class AppMenuitemComponent implements OnInit {
  public appMain: AppMainComponent = inject(AppMainComponent);
  private readonly router: Router = inject(Router);
  private readonly menuService: MenuService = inject(MenuService);
  @Input({ required: true }) item: FiyuMenuItem;
  @Input({ required: true }) index: number;
  @Input({ required: true }) root: boolean;
  @Input() parentKey: string;
  active = false;
  key: string;
  slimClick = false;

  constructor() {
    this.menuService.menuSource$.pipe(takeUntilDestroyed()).subscribe((key) => {
      // deactivate current active menu
      if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
        this.active = false;
      }
    });

    this.menuService.resetSource$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.active = false;
    });
  }

  ngOnInit() {
    /*
    if (!(this.appMain.isSlim() || this.appMain.isHorizontal()) && this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }
    */
    this.key = this.parentKey ? `${this.parentKey}-${this.index}` : String(this.index);
  }

  updateActiveStateFromRoute() {
    const urlTree = this.router.parseUrl(this.item.routerLink[0]);
    this.active = this.router.isActive(urlTree, {
      paths: 'exact',
      queryParams: 'exact',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });
  }

  itemClick(event: Event) {
    if (this.appMain.isSlim()) {
      this.slimClick = true;
    }

    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    // navigate with hover in horizontal mode
    if (this.root) {
      this.appMain.menuHoverActive = !this.appMain.menuHoverActive;
    }

    // notify other items
    this.menuService.onMenuStateChange(this.key);

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.items) {
      this.active = !this.active;
    } else {
      // activate item
      this.active = true;

      if (this.appMain.isMobile()) {
        this.appMain.staticMenuMobileActive = false;
      }

      // reset horizontal menu
      if (this.appMain.isSlim() || this.appMain.isHorizontal()) {
        this.menuService.reset();
        this.appMain.menuHoverActive = false;
      }

      this.appMain.unblockBodyScroll();
    }

    this.removeActiveInk(event);
  }

  onMouseEnter() {
    // activate item on hover
    if (this.root && (this.appMain.isSlim() || this.appMain.isHorizontal()) && this.appMain.isDesktop()) {
      if (this.appMain.menuHoverActive) {
        this.menuService.onMenuStateChange(this.key);
        this.active = true;
        this.slimClick = false;
      } else {
        if (this.appMain.isSlim()) {
          this.slimClick = true;
        }
      }
    }
  }
  removeActiveInk(event: Event) {
    const currentTarget = event.currentTarget as HTMLElement;
    setTimeout(() => {
      if (currentTarget) {
        const activeInk = currentTarget.querySelector('.p-ink-active');
        if (activeInk) {
          if (activeInk.classList) activeInk.classList.remove('p-ink-active');
          else
            activeInk.className = activeInk.className.replace(
              new RegExp('(^|\\b)' + 'p-ink-active'.split(' ').join('|') + '(\\b|$)', 'gi'),
              ' ',
            );
        }
      }
    }, 401);
  }
}
