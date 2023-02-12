import type { StorageConfig, StorageDriver } from './types';
export declare class Storage {
    config: StorageConfig;
    constructor(config: StorageConfig);
    disk(name: string): StorageDriver;
}
