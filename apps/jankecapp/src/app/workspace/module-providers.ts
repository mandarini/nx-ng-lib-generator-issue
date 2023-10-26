import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { WorkspaceModuleMetadataService } from './workspace-module-metadata.service';

export function provideWorkspaceModuleProviders(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: 'WorkspaceModuleMetadataService',
      useClass: WorkspaceModuleMetadataService,
    },
  ]);
}
