import { TestBed } from '@angular/core/testing';
import { MountConfig } from 'cypress/angular';
import { ForgotPasswordFormComponent } from './forgot-password-form.component';

describe(ForgotPasswordFormComponent.name, () => {
  const config: MountConfig<ForgotPasswordFormComponent> = {
    imports: [],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(ForgotPasswordFormComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(ForgotPasswordFormComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(ForgotPasswordFormComponent, { add: { providers: config.providers } });
    cy.mount(ForgotPasswordFormComponent, config);
  });
});
