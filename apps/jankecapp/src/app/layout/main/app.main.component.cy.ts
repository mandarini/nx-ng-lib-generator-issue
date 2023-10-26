import { TestBed } from '@angular/core/testing';
import { MountConfig } from 'cypress/angular';
import { AppMainComponent } from './app.main.component';

describe(AppMainComponent.name, () => {
  const config: MountConfig<AppMainComponent> = {
    imports: [],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(AppMainComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppMainComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppMainComponent, { add: { providers: config.providers } });
    cy.mount(AppMainComponent, config);
  });
});
