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
const time_1 = __importDefault(require("../../time"));
class Start extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args, flags } = this.parse(Start);
            globalFlags_1.default.debug = flags.debug;
            yield tempo_1.default.startTracker({
                issueKeyOrAlias: args.issue_key_or_alias,
                description: flags.description,
                now: time_1.default.now(),
                stopPreviousTracker: flags['stop-previous']
            });
        });
    }
}
exports.default = Start;
Start.description = '[or start], start a new tracker';
Start.examples = [
    `${appName_1.appName} tracker:start abc-123`,
    `${appName_1.appName} start abc-123`,
    `${appName_1.appName} tracker:start abc-123 -d "worklog description"`
];
Start.aliases = ['start'];
Start.flags = {
    help: command_1.flags.help({ char: 'h' }),
    debug: command_1.flags.boolean(),
    description: command_1.flags.string({ char: 'd', description: 'description for worklog once tracker is stopped' }),
    'stop-previous': command_1.flags.boolean({ description: 'stops and logs previous tracker with the same issue key if it exists' })
};
Start.args = [
    {
        name: 'issue_key_or_alias',
        description: 'issue key, like abc-123 or alias',
        required: true
    }
];
//# sourceMappingURL=start.js.map