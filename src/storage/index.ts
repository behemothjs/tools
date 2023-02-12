import process from 'node:process';
import type {StorageConfig, StorageDriver} from './types';
import {S3Driver, type StorageDiskForS3} from './drivers/s3';
import {LocalDriver, type StorageDiskForLocal} from './drivers/local';

export class Storage {
	config: StorageConfig = {
		default: process.env.FILESYSTEM_DRIVER ?? 'local',
		disks: {
			local: {
				driver: 'local',
				root: '.',
			},
		},
	};

	constructor(config: StorageConfig) {
		this.config = config;
		this.disk(this.config.default);
	}

	disk(name: string): StorageDriver {
		const disk = this.config.disks[name];
		if (!disk) {
			throw new Error(`[Storage] disk ${name} not defined.`);
		}

		switch (disk.driver) {
			case 'local': {
				return new LocalDriver(this, disk as StorageDiskForLocal);
			}

			case 's3': {
				return new S3Driver(this, disk as StorageDiskForS3);
			}

			default: {
				throw new Error('[Storage] driver not supported.');
			}
		}
	}
}
