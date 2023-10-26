import { Injectable } from '@angular/core';
import { AbstractModuleMetadataService } from '@fiyu/core';
import { ModuleMetadata } from './module-metadata';

@Injectable({ providedIn: 'root' })
export class WorkspaceModuleMetadataService extends AbstractModuleMetadataService {
  constructor() {
    super(ModuleMetadata.getInstance());
  }
}
