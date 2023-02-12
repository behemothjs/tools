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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3RvcmFnZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnRUFBbUM7QUFFbkMscUNBQTZEO0FBQzdELDJDQUFzRTtBQUV0RSxNQUFhLE9BQU87SUFXbkIsWUFBWSxNQUFxQjs7UUFWakMsV0FBTSxHQUFrQjtZQUN2QixPQUFPLEVBQUUsTUFBQSxzQkFBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsbUNBQUksT0FBTztZQUNqRCxLQUFLLEVBQUU7Z0JBQ04sS0FBSyxFQUFFO29CQUNOLE1BQU0sRUFBRSxPQUFPO29CQUNmLElBQUksRUFBRSxHQUFHO2lCQUNUO2FBQ0Q7U0FDRCxDQUFDO1FBR0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBWTtRQUNoQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSxlQUFlLENBQUMsQ0FBQztTQUN2RDtRQUVELFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNwQixLQUFLLE9BQU8sQ0FBQyxDQUFDO2dCQUNiLE9BQU8sSUFBSSxtQkFBVyxDQUFDLElBQUksRUFBRSxJQUEyQixDQUFDLENBQUM7YUFDMUQ7WUFFRCxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUNWLE9BQU8sSUFBSSxhQUFRLENBQUMsSUFBSSxFQUFFLElBQXdCLENBQUMsQ0FBQzthQUNwRDtZQUVELE9BQU8sQ0FBQyxDQUFDO2dCQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQzthQUNuRDtTQUNEO0lBQ0YsQ0FBQztDQUNEO0FBcENELDBCQW9DQyJ9