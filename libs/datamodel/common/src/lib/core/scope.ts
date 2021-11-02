export interface Scope {
    audience: string;
    id: string;
    description: string;
}

export type ScopeGroup = {[scope: string]: Scope};

export type Scopes = {[id: string]: ScopeGroup};
