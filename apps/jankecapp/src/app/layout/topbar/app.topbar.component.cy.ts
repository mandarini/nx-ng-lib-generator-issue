import { TestBed } from '@angular/core/testing';
import { MountConfig } from 'cypress/angular';
import { AppTopBarComponent } from './app.topbar.component';

describe(AppTopBarComponent.name, () => {
  const config: MountConfig<AppTopBarComponent> = {
    imports: [],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(AppTopBarComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppTopBarComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppTopBarComponent, { add: { providers: config.providers } });
    cy.mount(AppTopBarComponent, config);
  });
});
