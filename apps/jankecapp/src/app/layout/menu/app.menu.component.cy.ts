import { TestBed } from '@angular/core/testing';
import { MountConfig } from 'cypress/angular';
import { AppMenuComponent } from './app.menu.component';

describe(AppMenuComponent.name, () => {
  const config: MountConfig<AppMenuComponent> = {
    imports: [],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(AppMenuComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppMenuComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppMenuComponent, { add: { providers: config.providers } });
    cy.mount(AppMenuComponent, config);
  });
});
