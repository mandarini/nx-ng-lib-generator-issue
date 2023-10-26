import { TestBed } from '@angular/core/testing';
import { MountConfig } from 'cypress/angular';
import { AppLoginComponent } from './app.login.component';

describe(AppLoginComponent.name, () => {
  const config: MountConfig<AppLoginComponent> = {
    imports: [],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(AppLoginComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppLoginComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppLoginComponent, { add: { providers: config.providers } });
    cy.mount(AppLoginComponent, config);
  });
});
