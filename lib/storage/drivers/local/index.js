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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalDriver = void 0;
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
class LocalDriver {
    constructor(storage, disk) {
        this._disk = disk;
        this.disk = storage.disk;
    }
    createReadStream(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { root } = this._disk;
            filePath = node_path_1.default.join(root, filePath);
            return (0, node_fs_1.createReadStream)(filePath);
        });
    }
    createWriteStream(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { root } = this._disk;
            filePath = node_path_1.default.join(root, filePath);
            return (0, node_fs_1.createWriteStream)(filePath);
        });
    }
    files(prefix, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const { root } = this._disk;
            const files = yield (0, promises_1.readdir)(root).then(files => files.filter(file => (prefix ? file.startsWith(prefix) : true)));
            return limit ? files.splice(0, limit) : files;
        });
    }
    get(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { root } = this._disk;
            filePath = node_path_1.default.join(root, filePath);
            return (0, promises_1.readFile)(filePath, { encoding: 'utf8' });
        });
    }
    put(filePath, contents) {
        return __awaiter(this, void 0, void 0, function* () {
            const { root } = this._disk;
            filePath = node_path_1.default.join(root, filePath);
            yield (0, promises_1.writeFile)(filePath, new TextEncoder().encode(contents));
        });
    }
    delete(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { root } = this._disk;
            filePath = node_path_1.default.join(root, filePath);
            yield (0, promises_1.unlink)(filePath);
        });
    }
    // Actions
    copy(fromFilePath, toFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { root } = this._disk;
            fromFilePath = node_path_1.default.join(root, fromFilePath);
            toFilePath = node_path_1.default.join(root, toFilePath);
            yield (0, promises_1.copyFile)(fromFilePath, toFilePath);
        });
    }
    move(fromFilePath, toFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, promises_1.copyFile)(fromFilePath, toFilePath);
            yield this.delete(fromFilePath);
        });
    }
}
exports.LocalDriver = LocalDriver;
