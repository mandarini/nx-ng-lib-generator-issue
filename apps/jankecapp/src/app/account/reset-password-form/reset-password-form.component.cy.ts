import { TestBed } from '@angular/core/testing';
import { MountConfig } from 'cypress/angular';
import { ResetPasswordFormComponent } from './reset-password-form.component';

describe(ResetPasswordFormComponent.name, () => {
  const config: MountConfig<ResetPasswordFormComponent> = {
    imports: [],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(ResetPasswordFormComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(ResetPasswordFormComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(ResetPasswordFormComponent, { add: { providers: config.providers } });
    cy.mount(ResetPasswordFormComponent, config);
  });
});
