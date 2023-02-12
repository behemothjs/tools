/// <reference types="node" />
import { type Readable, type Writable, type StorageDriver, type StorageDisk } from '../../types';
import { type Storage } from '../..';
export type StorageDiskForLocal = {
    driver: 'local';
    root: string;
} & StorageDisk;
export declare class LocalDriver implements StorageDriver {
    disk: (name: string) => StorageDriver;
    private readonly _disk;
    constructor(storage: Storage, disk: StorageDiskForLocal);
    createReadStream(filePath: string): Promise<Readable>;
    createWriteStream(filePath: string): Promise<Writable>;
    files(prefix?: string, limit?: number): Promise<string[]>;
    get(filePath: string): Promise<string>;
    put(filePath: string, contents: string): Promise<void>;
    delete(filePath: string): Promise<void>;
    copy(fromFilePath: string, toFilePath: string): Promise<void>;
    move(fromFilePath: string, toFilePath: string): Promise<void>;
}
