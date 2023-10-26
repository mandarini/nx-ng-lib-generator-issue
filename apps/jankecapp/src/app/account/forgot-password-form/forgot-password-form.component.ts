import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ColorScheme,
  ControlsOf,
  SharedTranslateKeys,
  THEME_CONFIG_TOKEN,
  ThemeConfig,
  VALIDATION_ERRORS_TOKEN,
  ValidationErrorsConfig,
} from '@fiyu/api';
import { ErrorHandlerService, FeedbackService, ForgotPassword, SecurityService } from '@fiyu/core';
import { FeedbackBarComponent } from '@fiyu/ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';

@Component({
  selector: 'fiyu-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    FeedbackBarComponent,
    NgOptimizedImage,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class ForgotPasswordFormComponent implements OnInit {
  public readonly themeConfig$: Observable<ThemeConfig> = inject(THEME_CONFIG_TOKEN);
  public form: FormGroup<ControlsOf<ForgotPassword>>;
  public isVerificationCodeVisible = false;
  public sharedTranslateKeys = SharedTranslateKeys;
  public colorScheme = ColorScheme;
  private readonly validationErrorsConfig: ValidationErrorsConfig = inject(VALIDATION_ERRORS_TOKEN, {
    optional: true,
    skipSelf: false,
    self: false,
    host: false,
  });
  private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly router: Router = inject(Router);
  private readonly securityService: SecurityService = inject(SecurityService);
  private readonly feedbackService: FeedbackService = inject(FeedbackService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  sendForgotPasswordEmail() {
    const forgotPasswordModel: ForgotPassword = {
      email: this.form.getRawValue().email,
    };
    this.securityService
      .forgotPassword(forgotPasswordModel)
      .pipe(
        // catchError((error: unknown) => throwError(() => error)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (_response: any) => {
          this.feedbackService.successBarMessage(
            this.translateService.instant(this.sharedTranslateKeys.ForgotPasswordSuccessMessage),
          );
          setTimeout(() => {
            this.feedbackService.successBarMessage('');
          }, 5000);
        },
        error: (e: unknown) => {
          this.errorHandlerService.showServerValidationErrors(e, this.validationErrorsConfig);
          setTimeout(() => {
            this.feedbackService.errorBarMessage('');
          }, 5000);
        },
        complete: () => {
          this.router.navigateByUrl('/reset-password');
        },
      });
  }
}
