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
class Stop extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args, flags } = this.parse(Stop);
            globalFlags_1.default.debug = flags.debug;
            yield tempo_1.default.stopTracker({
                issueKeyOrAlias: args.issue_key_or_alias,
                description: flags.description,
                remainingEstimate: flags['remaining-estimate'],
                now: time_1.default.now()
            });
        });
    }
}
exports.default = Stop;
Stop.description = '[or stop], stop a tracker and log it';
Stop.examples = [
    `${appName_1.appName} tracker:stop abc-123`,
    `${appName_1.appName} stop abc-123`,
    `${appName_1.appName} tracker:stop abc-123 -d "worklog description"`
];
Stop.aliases = ['stop'];
Stop.flags = {
    help: command_1.flags.help({ char: 'h' }),
    debug: command_1.flags.boolean(),
    description: command_1.flags.string({ char: 'd', description: 'description for worklog' }),
    'remaining-estimate': command_1.flags.string({ char: 'r', description: 'remaining estimate' })
};
Stop.args = [
    {
        name: 'issue_key_or_alias',
        description: 'issue key, like abc-123 or alias',
        required: true
    }
];
//# sourceMappingURL=stop.js.map