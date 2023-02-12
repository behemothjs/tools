/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import {
	S3Client,
	ListObjectsCommand,
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';
import {type Storage} from '../..';
import {
	type Readable,
	type Writable,
	type StorageDriver,
	type StorageDisk,
} from '../../types';

export type StorageDiskForS3 = {
	driver: 's3';
	root: string;
	bucket: string;
	region: string;
} & StorageDisk;

type StorageDriverForS3 = {
	putStream(readStream: Readable, filePath: string): Promise<void>;
};

export class S3Driver implements StorageDriver, StorageDriverForS3 {
	disk: (name: string) => StorageDriver;
	private readonly _disk: StorageDiskForS3;

	constructor(storage: Storage, disk: StorageDiskForS3) {
		this._disk = disk;
		this.disk = storage.disk;
	}

	async createReadStream(filePath: string): Promise<Readable> {
		const {region, bucket, root} = this._disk;
		const s3Key = path.join(root, filePath);
		const client = new S3Client({region});
		const s3Out = await client.send(
			new GetObjectCommand({
				Bucket: bucket,
				Key: s3Key,
			}),
		);
		if (!s3Out.Body) {
			throw new Error('file.Body not found.');
		}

		return s3Out.Body as Readable;
	}

	async createWriteStream(filePath: string): Promise<Writable> {
		throw new Error('S3Driver createWriteStream not supported.');
	}

	async putStream(readStream: Readable, filePath: string): Promise<void> {
		const {region, bucket, root} = this._disk;
		const s3Key = path.join(root, filePath);
		const upload = new Upload({
			client: new S3Client({
				region,
			}),
			params: {
				Bucket: bucket,
				Key: s3Key,
				Body: readStream,
			},
		});
		try {
			await upload.done();
		} catch (error: unknown) {
			await upload.abort();
			throw error;
		}
	}

	async files(prefix?: string, limit?: number): Promise<string[]> {
		const {region, bucket, root} = this._disk;
		const s3Key = prefix ? path.join(root, prefix) : root;
		const client = new S3Client({region});
		const result = await client.send(
			new ListObjectsCommand({
				Bucket: bucket,
				Prefix: s3Key,
				MaxKeys: limit,
			}),
		);
		if (!result.Contents) {
			return [];
		}

		return result.Contents.map(object => object.Key).filter(
			Boolean,
		) as string[];
	}

	async get(filePath: string): Promise<string> {
		const {root} = this._disk;
		const s3Key = path.join(root, filePath);
		const rs = await this.createReadStream(s3Key);
		let contents = '';
		for await (const chunk of rs) {
			contents += chunk as string;
		}

		return contents;
	}

	async put(filePath: string, contents: string): Promise<void> {
		const {region, bucket, root} = this._disk;
		const s3Key = path.join(root, filePath);
		const client = new S3Client({region});
		const command = new PutObjectCommand({
			Bucket: bucket,
			Key: s3Key,
			Body: JSON.stringify(contents),
		});
		await client.send(command);
	}

	async delete(filePath: string): Promise<void> {
		const {region, bucket, root} = this._disk;
		const s3Key = path.join(root, filePath);
		const client = new S3Client({region});
		const command = new DeleteObjectCommand({
			Bucket: bucket,
			Key: s3Key,
		});
		await client.send(command);
	}

	async copy(from: string, to: string): Promise<void> {
		const rs = await this.createReadStream(from);
		await this.putStream(rs, to);
	}

	async move(from: string, to: string): Promise<void> {
		try {
			await this.copy(from, to);
			await this.delete(from);
		} catch (error: unknown) {
			await this.delete(to);
			throw error;
		}
	}
}
