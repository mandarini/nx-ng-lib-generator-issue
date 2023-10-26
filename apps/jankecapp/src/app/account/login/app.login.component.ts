import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ColorScheme,
  ControlsOf,
  LC_ACTIVE_ORGANIZATION_ID,
  Profile,
  ProfileOrganization,
  SharedTranslateKeys,
  THEME_CONFIG_TOKEN,
  ThemeConfig,
} from '@fiyu/api';
import {
  AzureService,
  CoreService,
  EnvironmentService,
  LoginUser,
  ProfileService,
  SecurityService,
  SecurityToken,
  StorageService,
  TokenOrganization,
} from '@fiyu/core';
import { FeedbackBarComponent } from '@fiyu/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'fiyu-login',
  templateUrl: './app.login.component.html',
  styleUrls: ['./app.login.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    NgOptimizedImage,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
    ProgressSpinnerModule,
    FeedbackBarComponent,
  ],
})
export class AppLoginComponent implements OnInit {
  public readonly themeConfig$: Observable<ThemeConfig> = inject(THEME_CONFIG_TOKEN);
  public form: FormGroup<ControlsOf<LoginUser>>;
  public errorMessage: string | undefined;
  public loading: boolean | undefined;
  public colorScheme = ColorScheme;
  public sharedTranslateKeys = SharedTranslateKeys;
  public readonly azureAuthEnabled: boolean = inject(EnvironmentService).azureAuthEnabled ?? false;
  private readonly router: Router = inject(Router);
  private readonly coreService: CoreService = inject(CoreService);
  private readonly secService: SecurityService = inject(SecurityService);
  private readonly azureService: AzureService = inject(AzureService);
  private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly profileService: ProfileService = inject(ProfileService);
  private readonly storageService: StorageService = inject(StorageService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  initForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
    if (this.secService.isLoggedIn()) {
      this.router.navigateByUrl('');
    }
  }

  login() {
    this.loading = true;
    this.secService
      .login(this.form.get('username').value, this.form.get('password').value, this.form.get('rememberMe').value)
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        switchMap((_token: SecurityToken) => {
          return this.profileService.getUserProfile().pipe(
            switchMap((profile: Profile) => {
              if (!profile) {
                this.logout();
              } else {
                this.coreService.setUser(profile);
              }
              return this.profileService.getUserOrganizations().pipe(
                switchMap((organizations: ProfileOrganization[]) => {
                  // FIXME: this is a workaround for the fact that the backend returns all organizations, even deleted ones
                  // remove organizations not present in token
                  const userOrganizations: ProfileOrganization[] = this.remapOrganizations(organizations);
                  // remove organizations not present in token END
                  this.coreService.setUserOrganizations(userOrganizations);
                  const activeOrganizationId: string = this.storageService.getItem(LC_ACTIVE_ORGANIZATION_ID);
                  this.coreService.setCurrentOrganization(
                    activeOrganizationId ? activeOrganizationId : userOrganizations[0] ? userOrganizations[0].id : null,
                  );

                  return of(userOrganizations);
                }),
              );
            }),
          );
        }),
        catchError(() => {
          this.handleLoginError('Invalid email or password');
          return throwError(() => 'Login failed. Something bad happened; please try again later.');
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: () => this.handleLoginError('Invalid email or password'),
        complete: () => {
          this.errorMessage = null;
          this.router.navigateByUrl('/');
        },
      });
  }

  private remapOrganizations(organizations: ProfileOrganization[]) {
    const tokenOrgs: TokenOrganization[] = this.secService.getDecodedAccessToken().organizations;
    const userOrganizations: ProfileOrganization[] = [];
    organizations.forEach((org: ProfileOrganization) => {
      tokenOrgs.forEach((tokenOrg: TokenOrganization) => {
        if (tokenOrg.organizationId === org.id) {
          userOrganizations.push(org);
        }
      });
    });
    return userOrganizations;
  }

  azureLogin() {
    this.azureService.startAzureRedirect();
  }

  resolveUserOrganizations() {
    const organizationIds = this.getOrganizationIdsFromPermissions();

    this.coreService
      .getUserOrganizationsSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          if (results.length > 0) {
            this.coreService.setUserOrganizations(results);
            this.router.navigateByUrl('');
          } else {
            throw new Error(`Organizations with IDs: ${organizationIds.join(',')} don't exist.`);
          }
        },
        error: () => this.handleLoginError('Login failed. Contact your administrator for details.'),
      });
  }

  private getOrganizationIdsFromPermissions(): string[] {
    const organizations: TokenOrganization[] = this.secService.getDecodedAccessToken().organizations;
    const organizationIds: string[] = [];
    organizations.forEach((org: TokenOrganization) => {
      if (Object.hasOwn(org, 'organizationId')) {
        organizationIds.push(org.organizationId);
      }
    });

    return organizationIds;
  }

  /*   private disableLoadingSpinnerAfterGuardResolves() {
    this.router.events
      .pipe(
        filter((event) => event instanceof GuardsCheckEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.loading = false;
      });
  } */

  private handleLoginError(errorMessage: string) {
    this.secService.removeLoginDataFromStorage();
    this.loading = false;
    this.errorMessage = errorMessage;
  }

  logout() {
    this.loading = false;
  }
}
