import {type Readable, type Writable} from 'node:stream';

export {Readable, Writable} from 'node:stream';

export type StorageConfig = {
	default: string;
	disks: StorageDiskCategory;
};

export type StorageDiskCategory = Record<string, StorageDisk>;

export type StorageDisk = {
	driver: any;
	root: string;
};

//

export type ProgressEvent = {
	loaded: number;
	total: number;
	part: number;
	Key: string;
	Bucket: string;
};

export type ProgressListener = (progress: ProgressEvent) => void;

//

export type StorageDriver = {
	disk: (name: string) => StorageDriver;
	//
	createReadStream(filePath: string): Promise<Readable>;
	createWriteStream(filePath: string): Promise<Writable>;
	//
	files(prefix?: string, limit?: number): Promise<string[]>;
	//
	get(filePath: string): Promise<string>;
	put(filePath: string, contents: string): Promise<void>;
	delete(filePath: string): Promise<void>;
	//
	copy(from: string, to: string, listener?: ProgressListener): Promise<void>;
	move(from: string, to: string, listener?: ProgressListener): Promise<void>;
};
