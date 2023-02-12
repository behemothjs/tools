/// <reference types="node" />
import { type Storage } from '../..';
import { type Readable, type Writable, type StorageDriver, type StorageDisk } from '../../types';
export type StorageDiskForS3 = {
    driver: 's3';
    root: string;
    bucket: string;
    region: string;
} & StorageDisk;
type StorageDriverForS3 = {
    putStream(readStream: Readable, filePath: string): Promise<void>;
};
export declare class S3Driver implements StorageDriver, StorageDriverForS3 {
    disk: (name: string) => StorageDriver;
    private readonly _disk;
    constructor(storage: Storage, disk: StorageDiskForS3);
    createReadStream(filePath: string): Promise<Readable>;
    createWriteStream(filePath: string): Promise<Writable>;
    putStream(readStream: Readable, filePath: string): Promise<void>;
    files(prefix?: string, limit?: number): Promise<string[]>;
    get(filePath: string): Promise<string>;
    put(filePath: string, contents: string): Promise<void>;
    delete(filePath: string): Promise<void>;
    copy(from: string, to: string): Promise<void>;
    move(from: string, to: string): Promise<void>;
}
export {};
