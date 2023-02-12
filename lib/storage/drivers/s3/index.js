"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const node_path_1 = __importDefault(require("node:path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const types_1 = require("../../types");
class S3Driver {
    constructor(storage, disk) {
        this._disk = disk;
        this.disk = storage.disk;
    }
    createReadStream(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { region, bucket, root } = this._disk;
            const s3Key = node_path_1.default.join(root, filePath);
            const client = new client_s3_1.S3Client({ region });
            const s3Out = yield client.send(new client_s3_1.GetObjectCommand({
                Bucket: bucket,
                Key: s3Key,
            }));
            if (!s3Out.Body) {
                throw new Error('file.Body not found.');
            }
            return s3Out.Body;
        });
    }
    createWriteStream(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { root } = this._disk;
            filePath = node_path_1.default.join(root, filePath);
            throw new Error('S3Driver createWriteStream not supported.');
            return new types_1.Writable();
        });
    }
    putStream(readStream, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield upload.done();
            }
            catch (error) {
                upload.abort();
                throw error;
            }
        });
    }
    files(prefix, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const { region, bucket, root } = this._disk;
            const s3Key = prefix ? node_path_1.default.join(root, prefix) : root;
            const client = new client_s3_1.S3Client({ region });
            const res = yield client.send(new client_s3_1.ListObjectsCommand({
                Bucket: bucket,
                Prefix: s3Key,
                MaxKeys: limit,
            }));
            if (!res.Contents) {
                return [];
            }
            return res.Contents.map((object) => object.Key).filter(Boolean);
        });
    }
    get(filePath) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { root } = this._disk;
            const s3Key = node_path_1.default.join(root, filePath);
            const rs = yield this.createReadStream(s3Key);
            let contents = '';
            try {
                for (var _d = true, rs_1 = __asyncValues(rs), rs_1_1; rs_1_1 = yield rs_1.next(), _a = rs_1_1.done, !_a;) {
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
                    if (!_d && !_a && (_b = rs_1.return)) yield _b.call(rs_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return contents;
        });
    }
    put(filePath, contents) {
        return __awaiter(this, void 0, void 0, function* () {
            const { region, bucket, root } = this._disk;
            const s3Key = node_path_1.default.join(root, filePath);
            const client = new client_s3_1.S3Client({ region });
            const command = new client_s3_1.PutObjectCommand({
                Bucket: bucket,
                Key: s3Key,
                Body: JSON.stringify(contents),
            });
            yield client.send(command);
        });
    }
    delete(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { region, bucket, root } = this._disk;
            const s3Key = node_path_1.default.join(root, filePath);
            const client = new client_s3_1.S3Client({ region });
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: bucket,
                Key: s3Key,
            });
            yield client.send(command);
        });
    }
    copy(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.createReadStream(from);
            yield this.putStream(rs, to);
        });
    }
    move(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.copy(from, to);
                yield this.delete(from);
            }
            catch (error) {
                yield this.delete(to);
                throw error;
            }
        });
    }
}
exports.S3Driver = S3Driver;
