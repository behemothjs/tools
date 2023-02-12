"use strict";
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
    async createReadStream(filePath) {
        const { root } = this._disk;
        filePath = node_path_1.default.join(root, filePath);
        return (0, node_fs_1.createReadStream)(filePath);
    }
    async createWriteStream(filePath) {
        const { root } = this._disk;
        filePath = node_path_1.default.join(root, filePath);
        return (0, node_fs_1.createWriteStream)(filePath);
    }
    async files(prefix, limit) {
        const { root } = this._disk;
        const files = await (0, promises_1.readdir)(root).then(files => files.filter(file => (prefix ? file.startsWith(prefix) : true)));
        return limit ? files.splice(0, limit) : files;
    }
    async get(filePath) {
        const { root } = this._disk;
        filePath = node_path_1.default.join(root, filePath);
        return (0, promises_1.readFile)(filePath, { encoding: 'utf8' });
    }
    async put(filePath, contents) {
        const { root } = this._disk;
        filePath = node_path_1.default.join(root, filePath);
        await (0, promises_1.writeFile)(filePath, new TextEncoder().encode(contents));
    }
    async delete(filePath) {
        const { root } = this._disk;
        filePath = node_path_1.default.join(root, filePath);
        await (0, promises_1.unlink)(filePath);
    }
    // Actions
    async copy(fromFilePath, toFilePath) {
        const { root } = this._disk;
        fromFilePath = node_path_1.default.join(root, fromFilePath);
        toFilePath = node_path_1.default.join(root, toFilePath);
        await (0, promises_1.copyFile)(fromFilePath, toFilePath);
    }
    async move(fromFilePath, toFilePath) {
        await this.copy(fromFilePath, toFilePath);
        await this.delete(fromFilePath);
    }
}
exports.LocalDriver = LocalDriver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvc3RvcmFnZS9kcml2ZXJzL2xvY2FsL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUE0RDtBQUM1RCwrQ0FBZ0Y7QUFDaEYsMERBQTZCO0FBYzdCLE1BQWEsV0FBVztJQUl2QixZQUFZLE9BQWdCLEVBQUUsSUFBeUI7UUFDdEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBZ0I7UUFDdEMsTUFBTSxFQUFDLElBQUksRUFBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDMUIsUUFBUSxHQUFHLG1CQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyQyxPQUFPLElBQUEsMEJBQWdCLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxRQUFnQjtRQUN2QyxNQUFNLEVBQUMsSUFBSSxFQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMxQixRQUFRLEdBQUcsbUJBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBQSwyQkFBaUIsRUFBQyxRQUFRLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFlLEVBQUUsS0FBYztRQUMxQyxNQUFNLEVBQUMsSUFBSSxFQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUEsa0JBQU8sRUFBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FDOUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUMvRCxDQUFDO1FBQ0YsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDL0MsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBZ0I7UUFDekIsTUFBTSxFQUFDLElBQUksRUFBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDMUIsUUFBUSxHQUFHLG1CQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyQyxPQUFPLElBQUEsbUJBQVEsRUFBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQzNDLE1BQU0sRUFBQyxJQUFJLEVBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzFCLFFBQVEsR0FBRyxtQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFBLG9CQUFTLEVBQUMsUUFBUSxFQUFFLElBQUksV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBZ0I7UUFDNUIsTUFBTSxFQUFDLElBQUksRUFBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDMUIsUUFBUSxHQUFHLG1CQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUEsaUJBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQsVUFBVTtJQUVWLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBb0IsRUFBRSxVQUFrQjtRQUNsRCxNQUFNLEVBQUMsSUFBSSxFQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMxQixZQUFZLEdBQUcsbUJBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzdDLFVBQVUsR0FBRyxtQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDekMsTUFBTSxJQUFBLG1CQUFRLEVBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQW9CLEVBQUUsVUFBa0I7UUFDbEQsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMxQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUNEO0FBNURELGtDQTREQyJ9