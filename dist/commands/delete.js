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
const command_1 = require("@oclif/command");
const appName_1 = require("../appName");
const tempo_1 = __importDefault(require("../tempo"));
const globalFlags_1 = __importDefault(require("../globalFlags"));
class Delete extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { argv, flags } = this.parse(Delete);
            globalFlags_1.default.debug = flags.debug;
            yield tempo_1.default.deleteWorklogs(argv);
        });
    }
}
exports.default = Delete;
Delete.description = '[or d], delete the worklog with given id, this can be used also to delete a multiple worklogs';
Delete.examples = [
    `${appName_1.appName} delete 123456`,
    `${appName_1.appName} d 123456`,
    `${appName_1.appName} delete 123456 123457`
];
Delete.strict = false;
Delete.aliases = ['d'];
Delete.flags = {
    help: command_1.flags.help({ char: 'h' }),
    debug: command_1.flags.boolean()
};
Delete.args = [
    {
        name: 'worklog_id',
        description: 'worklog ids to delete, like 123456',
        required: true
    }
];
//# sourceMappingURL=delete.js.map