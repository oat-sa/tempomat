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
const appName_1 = require("../../appName");
const tempo_1 = __importDefault(require("../../tempo"));
const globalFlags_1 = __importDefault(require("../../globalFlags"));
class Set extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args, flags } = this.parse(Set);
            globalFlags_1.default.debug = flags.debug;
            tempo_1.default.setAlias(args.alias_name, args.issue_key);
        });
    }
}
exports.default = Set;
Set.description = 'set issue key alias, then alias can be used instead of issue key';
Set.examples = [
    `${appName_1.appName} alias:set lunch abc-123`
];
Set.flags = {
    help: command_1.flags.help({ char: 'h' }),
    debug: command_1.flags.boolean()
};
Set.args = [
    {
        name: 'alias_name',
        required: true
    },
    {
        name: 'issue_key',
        description: 'issue key, like abc-123',
        required: true
    }
];
//# sourceMappingURL=set.js.map