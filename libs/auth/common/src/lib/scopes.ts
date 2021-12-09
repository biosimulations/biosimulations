import { ScopesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface Scope {
  audience: string;
  id: string;
  description: string;
}

export type ScopeGroup = { [scope: string]: Scope };

export type Scopes = { [id: string]: ScopeGroup };

export const BIOSIMULATIONS_AUDIENCE = 'api.biosimulations.org';
export const BIOSIMULATORS_AUDIENCE = 'api.biosimulators.org';
export const ACCOUNT_AUDIENCE = 'account.biosimulations.org';
export const USER_AUDIENCE = 'https://crbm.auth0.com/api/v2/';

export const scopes: Scopes = {
  simulators: {
    read: {
      audience: BIOSIMULATORS_AUDIENCE,
      id: 'read:Simulators',
      description: 'Get information about simulation tools',
    },
    create: {
      audience: BIOSIMULATORS_AUDIENCE,
      id: 'write:Simulators',
      description: 'Write and modify simulation tools',
    },
    update: {
      audience: BIOSIMULATORS_AUDIENCE,
      id: 'write:Simulators',
      description: 'Write and modify simulation tools',
    },
    delete: {
      audience: BIOSIMULATORS_AUDIENCE,
      id: 'delete:Simulators',
      description: 'Delete simulation tools',
    },
    deleteAll: {
      audience: BIOSIMULATORS_AUDIENCE,
      id: 'deleteAll:Simulators',
      description: 'Delete all simulation tools',
    },
  },
  images: {
    refresh: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'refresh:Images',
      description: 'Build or re-build Singularity images',
    },
  },
  simulationRuns: {
    read: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'read:SimulationRuns',
      description: 'Get information about simulation runs',
    },
    create: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:SimulationRuns',
      description: 'Modify simulation runs, including their status',
    },
    update: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:SimulationRuns',
      description: 'Modify simulation runs, including their status',
    },
    externallyValidate: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'externallyValidate:SimulationRuns',
      description:
        'Externally validate simulation runs. Grants the ability to include requests to publish simulation runs with their creation.',
    },
    delete: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'delete:SimulationRuns',
      description: 'Delete simulation runs',
    },
  },
  email: {
    read: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'read:Email',
      description: 'Read contact email addresses for resources',
    },
  },
  files: {
    read: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'read:Files',
      description: 'Get information about files of simulation runs',
    },
    create: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Files',
      description: 'Write and modify files for simulation runs',
    },
    update: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Files',
      description: 'Write and modify files for simulation runs',
    },
    delete: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'delete:Files',
      description: 'Delete files for simulation runs',
    },
  },
  specifications: {
    read: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'read:Specifications',
      description:
        'Get information about simulation experiments of simulation runs',
    },
    create: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Specifications',
      description:
        'Write and modify simulation experiments for simulation runs',
    },
    update: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Specifications',
      description:
        'Write and modify simulation experiments for simulation runs',
    },
    delete: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'delete:Specifications',
      description: 'Delete simulation experiments for simulation runs',
    },
  },
  results: {
    read: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'read:Results',
      description: 'Get the results of simulation runs',
    },
    create: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Results',
      description: 'Modify the results of simulation runs',
    },
    update: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Results',
      description: 'Modify the results of simulation runs',
    },
    delete: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'delete:Results',
      description: 'Delete the results of simulation runs',
    },
  },
  logs: {
    read: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'read:Logs',
      description: 'Get the logs of simulation runs',
    },
    create: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Logs',
      description: 'Modify the logs of simulation runs',
    },
    update: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Logs',
      description: 'Modify the logs of simulation runs',
    },
    delete: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'delete:Logs',
      description: 'Delete the logs of simulation runs',
    },
  },
  metadata: {
    read: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'read:Metadata',
      description: 'Get the metadata for simulation runs',
    },
    create: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Metadata',
      description: 'Modify the metadata for simulation runs',
    },
    update: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'write:Metadata',
      description: 'Modify the metadata for simulation runs',
    },
    delete: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'delete:Metadata',
      description: 'Delete the metadata for simulation runs',
    },
  },
  projects: {
    read: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'read:Projects',
      description: 'Get information about published projects',
    },
    create: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'create:Projects',
      description: 'Create published projects',
    },
    update: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'update:Projects',
      description: 'Modify published projects',
    },
    delete: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'delete:Projects',
      description: 'Delete published projects',
    },
    proxyOwnership: {
      audience: BIOSIMULATIONS_AUDIENCE,
      id: 'proxyOwnership:Projects',
      description: 'Delete published projects',
    },
  },
  accounts: {
    read: {
      audience: ACCOUNT_AUDIENCE,
      id: 'read:accounts',
      description: 'Get information about accounts',
    },
    create: {
      audience: ACCOUNT_AUDIENCE,
      id: 'create:account',
      description: 'Create accounts',
    },
    update: {
      audience: ACCOUNT_AUDIENCE,
      id: 'edit:accounts',
      description: 'Modify accounts',
    },
    delete: {
      audience: ACCOUNT_AUDIENCE,
      id: 'delete:accounts',
      description: 'Delete accounts',
    },
  },
  users: {
    read: {
      audience: USER_AUDIENCE,
      id: 'read:users',
      description: 'Get information about user accounts',
    },
    create: {
      audience: USER_AUDIENCE,
      id: 'create:users',
      description: 'Create user accounts',
    },
    update: {
      audience: USER_AUDIENCE,
      id: 'update:users',
      description: 'Modify user accounts',
    },
    delete: {
      audience: USER_AUDIENCE,
      id: 'delete:users',
      description: 'Delete user accounts',
    },
  },
  clients: {
    read: {
      audience: USER_AUDIENCE,
      id: 'read:clients',
      description: 'Get information about machine accounts',
    },
  },
  organizations: {
    read: {
      audience: USER_AUDIENCE,
      id: 'read:organizations',
      description: 'Get information about organizations',
    },
  },
  permissions: {
    test: {
      audience: USER_AUDIENCE,
      id: 'test:permissions',
      description: 'Test user permissions',
    },
  },
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
