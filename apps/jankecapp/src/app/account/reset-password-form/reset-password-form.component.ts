import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControlOptions,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import {
  EncryptService,
  ErrorHandlerService,
  FeedbackService,
  FiyuValidators,
  ResetPassword,
  SecurityService,
} from '@fiyu/core';
import { FeedbackBarComponent } from '@fiyu/ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'fiyu-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    NgOptimizedImage,
    ReactiveFormsModule,
    ButtonModule,
    InputMaskModule,
    PasswordModule,
    TranslateModule,
    FeedbackBarComponent,
  ],
})
export class ResetPasswordFormComponent implements OnInit {
  public readonly themeConfig$: Observable<ThemeConfig> = inject(THEME_CONFIG_TOKEN);
  public form: FormGroup<ControlsOf<ResetPassword>>;
  public colorScheme = ColorScheme;
  public sharedTranslateKeys = SharedTranslateKeys;
  private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly router: Router = inject(Router);
  private readonly securityService: SecurityService = inject(SecurityService);
  private readonly feedbackService: FeedbackService = inject(FeedbackService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly encryptService: EncryptService = inject(EncryptService);
  private readonly errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly validationErrorsConfig: ValidationErrorsConfig = inject(VALIDATION_ERRORS_TOKEN, {
    optional: true,
    skipSelf: false,
    self: false,
    host: false,
  });

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group(
      {
        verificationCode: [
          { value: null, disabled: false },
          Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
        ],
        newPassword: [
          '',
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            FiyuValidators.patternValidator(/\d/, {
              hasNumber: true,
            }),
            // check whether the entered password has upper case letter
            FiyuValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            // check whether the entered password has a lower case letter
            FiyuValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            // check whether the entered password has a special character

            FiyuValidators.patternValidator(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
              hasSpecialCharacters: true,
            }),
            Validators.minLength(8),
          ]),
        ],
        confirmPassword: ['', Validators.compose([Validators.required])],
      },
      {
        // check whether our password and confirm password match
        validators: FiyuValidators.passwordMatchValidator,
      } as AbstractControlOptions,
    );
  }

  resetPassword() {
    /* @ts-ignore */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const publicKey$ = this.securityService
      .getPublicKey()
      .pipe(
        mergeMap((key: string) => {
          const resetPasswordModel: ResetPassword = {
            newPassword: this.encryptService.encrypt(this.form.getRawValue().newPassword, key),
            verificationCode: this.form.getRawValue().verificationCode,
            confirmPassword: this.encryptService.encrypt(this.form.getRawValue().confirmPassword, key),
          };
          return this.securityService
            .resetPassword(resetPasswordModel)
            .pipe(catchError((error: unknown) => throwError(() => error)));
        }),
        catchError((error: unknown) => throwError(() => error)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (_response: any) => {
          //  console.log(response);
        },
        error: (e: unknown) => {
          // console.log(e, new FiyuValidationError(e as FiyuValidationError));
          this.errorHandlerService.showServerValidationErrors(e, this.validationErrorsConfig);
          setTimeout(() => {
            this.feedbackService.errorBarMessage('');
          }, 5000);
        },
        complete: () => {
          this.feedbackService.successBarMessage(
            this.translateService.instant(this.sharedTranslateKeys.ResetPasswordSuccessMessage),
          );
          setTimeout(() => {
            this.feedbackService.successBarMessage('');
          }, 1000);
          this.router.navigateByUrl('/login');
        },
      });
  }
}
