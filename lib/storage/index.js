"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const node_process_1 = __importDefault(require("node:process"));
const s3_1 = require("./drivers/s3");
const local_1 = require("./drivers/local");
class Storage {
    constructor(config) {
        var _a;
        this.config = {
            default: (_a = node_process_1.default.env.FILESYSTEM_DRIVER) !== null && _a !== void 0 ? _a : 'local',
            disks: {
                local: {
                    driver: 'local',
                    root: '.',
                },
            },
        };
        this.config = config;
        this.disk(this.config.default);
    }
    disk(name) {
        const disk = this.config.disks[name];
        if (!disk) {
            throw new Error(`[Storage] disk ${name} not defined.`);
        }
        switch (disk.driver) {
            case 'local': {
                return new local_1.LocalDriver(this, disk);
            }
            case 's3': {
                return new s3_1.S3Driver(this, disk);
            }
            default: {
                throw new Error('[Storage] driver not supported.');
            }
        }
    }
}
exports.Storage = Storage;
