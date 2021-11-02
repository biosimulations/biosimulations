import { Scopes, ScopeGroup, Scope } from '@biosimulations/datamodel/common';
import { ScopesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const scopes: Scopes = {
  simulators: {
    read: {
      audience: 'api.biosimulators.org',
      id: 'read:Simulators',
      description: 'Get information about simulation tools',
    },
    create: {
      audience: 'api.biosimulators.org',
      id: 'write:Simulators',
      description: 'Write and modify simulation tools',
    },
    update: {
      audience: 'api.biosimulators.org',
      id: 'write:Simulators',
      description: 'Write and modify simulation tools',
    },
    delete: {
      audience: 'api.biosimulators.org',
      id: 'delete:Simulators',
      description: 'Delete simulation tools',
    },
  },
  images: {
    refresh: {
      audience: 'dispatch.biosimulations.org',
      id: 'refresh:Images',
      description: 'Build or re-build Singularity images',
    },
  },
  simulationRuns: {
    read: {
      audience: 'dispatch.biosimulations.org',
      id: 'read:SimulationRuns',
      description: 'Get information about simulation runs',
    },
    create: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:SimulationRuns',
      description: 'Modify simulation runs, including their status',
    },
    update: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:SimulationRuns',
      description: 'Modify simulation runs, including their status',
    },
    delete: {
      audience: 'dispatch.biosimulations.org',
      id: 'delete:SimulationRuns',
      description: 'Delete simulation runs',
    },
  },
  email: {
    read: {
      audience: 'dispatch.biosimulations.org',
      id: 'read:Email',
      description: 'Read contact email addresses for results of simulation runs'
    },
  },
  files: {
    read: {
      audience: 'dispatch.biosimulations.org',
      id: 'read:Files',
      description: 'Get information about files of simulation runs',
    },
    create: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Files',
      description: 'Write and modify files for simulation runs',
    },
    update: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Files',
      description: 'Write and modify files for simulation runs',
    },
    delete: {
      audience: 'dispatch.biosimulations.org',
      id: 'delete:Files',
      description: 'Delete files for simulation runs',
    },
  },
  specifications: {
    read: {
      audience: 'dispatch.biosimulations.org',
      id: 'read:Specifications',
      description: 'Get information about simulation experiments of simulation runs',
    },
    create: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Specifications',
      description: 'Write and modify simulation experiments for simulation runs',
    },
    update: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Specifications',
      description: 'Write and modify simulation experiments for simulation runs',
    },
    delete: {
      audience: 'dispatch.biosimulations.org',
      id: 'delete:Specifications',
      description: 'Delete simulation experiments for simulation runs',
    },
  },
  results: {
    read: {
      audience: 'dispatch.biosimulations.org',
      id: 'read:Results',
      description: 'Get the results of simulation runs',
    },
    create: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Results',
      description: 'Modify the results of simulation runs',
    },
    update: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Results',
      description: 'Modify the results of simulation runs',
    },
    delete: {
      audience: 'dispatch.biosimulations.org',
      id: 'delete:Results',
      description: 'Delete the results of simulation runs',
    },        
  },    
  logs: {
    read: {
      audience: 'dispatch.biosimulations.org',
      id: 'read:Logs',
      description: 'Get the logs of simulation runs',
    },
    create: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Logs',
      description: 'Modify the logs of simulation runs',
    },
    update: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Logs',
      description: 'Modify the logs of simulation runs',
    },
    delete: {
      audience: 'dispatch.biosimulations.org',
      id: 'delete:Logs',
      description: 'Delete the logs of simulation runs',
    }
  },    
  metadata: {
    read: {
      audience: 'dispatch.biosimulations.org',
      id: 'read:Metadata',
      description: 'Get the metadata for simulation runs',
    },
    create: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Metadata',
      description: 'Modify the metadata for simulation runs',
    },
    update: {
      audience: 'dispatch.biosimulations.org',
      id: 'write:Metadata',
      description: 'Modify the metadata for simulation runs',
    },
    delete: {        
      audience: 'dispatch.biosimulations.org',
      id: 'delete:Metadata',
      description: 'Delete the metadata for simulation runs',
    },
  },    
  projects: {
    read: {
      audience: 'dispatch.biosimulations.org',
      id: 'read:Projects',
      description: 'Get information about published projects',
    },
    create: {
      audience: 'dispatch.biosimulations.org',
      id: 'create:Projects',
      description: 'Create published projects',
    },
    update: {
      audience: 'dispatch.biosimulations.org',
      id: 'update:Projects',
      description: 'Modify published projects',
    },
    delete: {
      audience: 'dispatch.biosimulations.org',
      id: 'delete:Projects',
      description: 'Delete published projects',
    },
    proxyOwnership: {
      audience: 'dispatch.biosimulations.org',
      id: 'proxyOwnership:Projects',
      description: 'Delete published projects',
    },
  },
  accounts: {
    read: {
      audience: 'account.biosimulations.org',
      id: 'read:accounts',
      description: 'Get information about accounts',
    },
    create: {
      audience: 'account.biosimulations.org',
      id: 'create:account',
      description: 'Create accounts',
    },
    update: {
      audience: 'account.biosimulations.org',
      id: 'edit:accounts',
      description: 'Modify accounts',
    },
    delete: {
      audience: 'account.biosimulations.org',
      id: 'delete:accounts',
      description: 'Delete accounts',
    },
  },
  users: {
    read: {
      audience: 'https://crbm.auth0.com/api/v2/',
      id: 'read:users',
      description: 'Get information about users',
    },
    create: {
      audience: 'https://crbm.auth0.com/api/v2/',
      id: 'create:users',
      description: 'Create users',
    },
    update: {
      audience: 'https://crbm.auth0.com/api/v2/',
      id: 'update:users',
      description: 'Modify users',
    },
    delete: {
      audience: 'https://crbm.auth0.com/api/v2/',
      id: 'delete:users',
      description: 'Delete users',
    },
  },
  permissions: {
    test: {
      audience: 'https://crbm.auth0.com/api/v2/',
      id: 'test:permissions',
      description: 'Get information about published projects',
    },
  }
};

export function getScopesForAudience(audience: string): ScopesObject {
  const scopesObject: ScopesObject = {};
  Object.values(scopes).forEach((group: ScopeGroup): void => {
    Object.values(group).forEach((scope: Scope): void => {
      if (scope.audience === audience) {
        scopesObject[scope.id] = scope.description;
      }
    });
  });
  return scopesObject;
}