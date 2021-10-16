export interface SystemStatus {
    biosimulationsApi: boolean;
    biosimulatorsApi: boolean;
    combineApi: boolean;
    ingressLoadBalancer: boolean;
    storageBuckets: boolean;
    backend: boolean;
}

export type SystemService = 'biosimulations-api' | 'bio-simulators-api' | 'combine-api' | 'ingress-loadbalancer' | 'storage-buckets' | 'backend';
