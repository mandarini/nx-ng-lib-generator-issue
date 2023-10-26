import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { MountConfig } from 'cypress/angular';
import { AppComponent } from './app.component';

describe(AppComponent.name, () => {
  const config: MountConfig<AppComponent> = {
    imports: [RouterOutlet],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(AppComponent, { add: { providers: config.providers } });
    cy.mount(AppComponent, config);
  });
});
