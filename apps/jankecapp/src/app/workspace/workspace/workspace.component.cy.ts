import { TestBed } from '@angular/core/testing';
import { MountConfig } from 'cypress/angular';
import { WorkspaceComponent } from './workspace.component';

describe(WorkspaceComponent.name, () => {
  const config: MountConfig<WorkspaceComponent> = {
    imports: [],
    providers: [],
  };

  it('renders', () => {
    TestBed.overrideComponent(WorkspaceComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(WorkspaceComponent, { add: { providers: config.providers } });
    TestBed.overrideComponent(WorkspaceComponent, { add: { providers: config.providers } });
    cy.mount(WorkspaceComponent, config);
  });
});
