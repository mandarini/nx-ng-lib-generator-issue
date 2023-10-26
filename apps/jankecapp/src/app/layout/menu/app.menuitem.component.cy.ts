import { TestBed } from '@angular/core/testing';
import { MountConfig } from 'cypress/angular';
import { AppMenuitemComponent } from './app.menuitem.component';

describe(AppMenuitemComponent.name, () => {
  const config: MountConfig<AppMenuitemComponent> = {
    imports: [],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(AppMenuitemComponent, { add: {} });
    TestBed.overrideComponent(AppMenuitemComponent, { add: {} });
    TestBed.overrideComponent(AppMenuitemComponent, { add: {} });
    cy.mount(AppMenuitemComponent, {
      ...config,
      componentProperties: {
        index: 0,
        root: false,
        parentKey: '',
      },
    });
  });
});
