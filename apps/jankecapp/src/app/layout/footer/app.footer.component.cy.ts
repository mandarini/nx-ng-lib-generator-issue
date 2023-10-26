import { TestBed } from '@angular/core/testing';
import { MountConfig } from 'cypress/angular';
import { AppFooterComponent } from './app.footer.component';

describe(AppFooterComponent.name, () => {
  const config: MountConfig<AppFooterComponent> = {
    imports: [],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(AppFooterComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppFooterComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(AppFooterComponent, { add: { providers: config.providers } });
    cy.mount(AppFooterComponent, config);
  });
});
