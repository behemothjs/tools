/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import { S3Client, ListObjectsCommand, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
export class S3Driver {
    disk;
    _disk;
    constructor(storage, disk) {
        this._disk = disk;
        this.disk = storage.disk;
    }
    async createReadStream(filePath) {
        const { region, bucket, root } = this._disk;
        const s3Key = path.join(root, filePath);
        const client = new S3Client({ region });
        const s3Out = await client.send(new GetObjectCommand({
            Bucket: bucket,
            Key: s3Key,
        }));
        if (!s3Out.Body) {
            throw new Error('file.Body not found.');
        }
        return s3Out.Body;
    }
    async createWriteStream(filePath) {
        throw new Error(`[S3Driver] createWriteStream not supported. filePath=${filePath}`);
    }
    async putStream(readStream, filePath) {
        const { region, bucket, root } = this._disk;
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
        }
        catch (error) {
            await upload.abort();
            throw error;
        }
    }
    async files(prefix, limit) {
        const { region, bucket, root } = this._disk;
        const s3Key = prefix ? path.join(root, prefix) : root;
        const client = new S3Client({ region });
        const result = await client.send(new ListObjectsCommand({
            Bucket: bucket,
            Prefix: s3Key,
            MaxKeys: limit,
        }));
        if (!result.Contents) {
            return [];
        }
        return result.Contents.map(object => object.Key).filter(Boolean);
    }
    async get(filePath) {
        const { root } = this._disk;
        const s3Key = path.join(root, filePath);
        const rs = await this.createReadStream(s3Key);
        let contents = '';
        for await (const chunk of rs) {
            contents += chunk;
        }
        return contents;
    }
    async put(filePath, contents) {
        const { region, bucket, root } = this._disk;
        const s3Key = path.join(root, filePath);
        const client = new S3Client({ region });
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: s3Key,
            Body: JSON.stringify(contents),
        });
        await client.send(command);
    }
    async delete(filePath) {
        const { region, bucket, root } = this._disk;
        const s3Key = path.join(root, filePath);
        const client = new S3Client({ region });
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: s3Key,
        });
        await client.send(command);
    }
    async copy(from, to) {
        const rs = await this.createReadStream(from);
        await this.putStream(rs, to);
    }
    async move(from, to) {
        try {
            await this.copy(from, to);
            await this.delete(from);
        }
        catch (error) {
            await this.delete(to);
            throw error;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvc3RvcmFnZS9kcml2ZXJzL3MzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDtBQUN6RCxPQUFPLElBQUksTUFBTSxXQUFXLENBQUM7QUFDN0IsT0FBTyxFQUNOLFFBQVEsRUFDUixrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixtQkFBbUIsR0FDbkIsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFvQjVDLE1BQU0sT0FBTyxRQUFRO0lBQ3BCLElBQUksQ0FBa0M7SUFDckIsS0FBSyxDQUFtQjtJQUV6QyxZQUFZLE9BQWdCLEVBQUUsSUFBc0I7UUFDbkQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBZ0I7UUFDdEMsTUFBTSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMxQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUM5QixJQUFJLGdCQUFnQixDQUFDO1lBQ3BCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsR0FBRyxFQUFFLEtBQUs7U0FDVixDQUFDLENBQ0YsQ0FBQztRQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFL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