"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Driver = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const node_path_1 = __importDefault(require("node:path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
class S3Driver {
    constructor(storage, disk) {
        this._disk = disk;
        this.disk = storage.disk;
    }
    async createReadStream(filePath) {
        const { region, bucket, root } = this._disk;
        const s3Key = node_path_1.default.join(root, filePath);
        const client = new client_s3_1.S3Client({ region });
        const s3Out = await client.send(new client_s3_1.GetObjectCommand({
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
        const s3Key = node_path_1.default.join(root, filePath);
        const upload = new lib_storage_1.Upload({
            client: new client_s3_1.S3Client({
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
        const s3Key = prefix ? node_path_1.default.join(root, prefix) : root;
        const client = new client_s3_1.S3Client({ region });
        const result = await client.send(new client_s3_1.ListObjectsCommand({
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
        var _a, e_1, _b, _c;
        const { root } = this._disk;
        const s3Key = node_path_1.default.join(root, filePath);
        const rs = await this.createReadStream(s3Key);
        let contents = '';
        try {
            for (var _d = true, rs_1 = __asyncValues(rs), rs_1_1; rs_1_1 = await rs_1.next(), _a = rs_1_1.done, !_a;) {
                _c = rs_1_1.value;
                _d = false;
                try {
                    const chunk = _c;
                    contents += chunk;
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = rs_1.return)) await _b.call(rs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return contents;
    }
    async put(filePath, contents) {
        const { region, bucket, root } = this._disk;
        const s3Key = node_path_1.default.join(root, filePath);
        const client = new client_s3_1.S3Client({ region });
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: s3Key,
            Body: JSON.stringify(contents),
        });
        await client.send(command);
    }
    async delete(filePath) {
        const { region, bucket, root } = this._disk;
        const s3Key = node_path_1.default.join(root, filePath);
        const client = new client_s3_1.S3Client({ region });
        const command = new client_s3_1.DeleteObjectCommand({
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
exports.S3Driver = S3Driver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvc3RvcmFnZS9kcml2ZXJzL3MzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSx5REFBeUQ7QUFDekQsMERBQTZCO0FBQzdCLGtEQU00QjtBQUM1QixzREFBNEM7QUFvQjVDLE1BQWEsUUFBUTtJQUlwQixZQUFZLE9BQWdCLEVBQUUsSUFBc0I7UUFDbkQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBZ0I7UUFDdEMsTUFBTSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMxQyxNQUFNLEtBQUssR0FBRyxtQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBUSxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQzlCLElBQUksNEJBQWdCLENBQUM7WUFDcEIsTUFBTSxFQUFFLE1BQU07WUFDZCxHQUFHLEVBQUUsS0FBSztTQUNWLENBQUMsQ0FDRixDQUFDO1FBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsT0FBTyxLQUFLLENBQUMsSUFBZ0IsQ0FBQztJQUMvQixDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFFBQWdCO1FBQ3ZDLE1BQU0sSUFBSSxLQUFLLENBQ2Qsd0RBQXdELFFBQVEsRUFBRSxDQUNsRSxD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