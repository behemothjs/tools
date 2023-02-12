import {createReadStream, createWriteStream} from 'node:fs';
import {readdir, readFile, writeFile, unlink, copyFile} from 'node:fs/promises';
import path from 'node:path';
import {
	type Readable,
	type Writable,
	type StorageDriver,
	type StorageDisk,
} from '../../types';
import {type Storage} from '../..';

export type StorageDiskForLocal = {
	driver: 'local';
	root: string;
} & StorageDisk;

export class LocalDriver implements StorageDriver {
	disk: (name: string) => StorageDriver;
	private readonly _disk: StorageDiskForLocal;

	constructor(storage: Storage, disk: StorageDiskForLocal) {
		this._disk = disk;
		this.disk = storage.disk;
	}

	async createReadStream(filePath: string): Promise<Readable> {
		const {root} = this._disk;
		filePath = path.join(root, filePath);
		return createReadStream(filePath);
	}

	async createWriteStream(filePath: string): Promise<Writable> {
		const {root} = this._disk;
		filePath = path.join(root, filePath);
		return createWriteStream(filePath);
	}

	async files(prefix?: string, limit?: number): Promise<string[]> {
		const {root} = this._disk;
		const files = await readdir(root).then(files =>
			files.filter(file => (prefix ? file.startsWith(prefix) : true)),
		);
		return limit ? files.splice(0, limit) : files;
	}

	async get(filePath: string): Promise<string> {
		const {root} = this._disk;
		filePath = path.join(root, filePath);
		return readFile(filePath, {encoding: 'utf8'});
	}

	async put(filePath: string, contents: string): Promise<void> {
		const {root} = this._disk;
		filePath = path.join(root, filePath);
		await writeFile(filePath, new TextEncoder().encode(contents));
	}

	async delete(filePath: string): Promise<void> {
		const {root} = this._disk;
		filePath = path.join(root, filePath);
		await unlink(filePath);
	}

	// Actions

	async copy(fromFilePath: string, toFilePath: string): Promise<void> {
		const {root} = this._disk;
		fromFilePath = path.join(root, fromFilePath);
		toFilePath = path.join(root, toFilePath);
		await copyFile(fromFilePath, toFilePath);
	}

	async move(fromFilePath: string, toFilePath: string): Promise<void> {
		await this.copy(fromFilePath, toFilePath);
		await this.delete(fromFilePath);
	}
}
