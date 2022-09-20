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
const trimIndent_1 = require("../trimIndent");
const tempo_1 = __importDefault(require("../tempo"));
const globalFlags_1 = __importDefault(require("../globalFlags"));
class Log extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args, flags } = this.parse(Log);
            globalFlags_1.default.debug = flags.debug;
            yield tempo_1.default.addWorklog({
                issueKeyOrAlias: args.issue_key_or_alias,
                durationOrInterval: args.duration_or_interval,
                when: args.when,
                description: flags.description,
                startTime: flags.start,
                remainingEstimate: flags['remaining-estimate']
            }, [
                {
                    value: args.type,
                    key: '_Type_'
                }
            ]);
        });
    }
}
exports.default = Log;
Log.description = '[or l], add a new worklog using duration or interval (abc-123 15m or abc-123 11-12:30)';
Log.examples = [
    `${appName_1.appName} log abc-123 1h `,
    `${appName_1.appName} l abc-123 1h `,
    `${appName_1.appName} log abc-123 15m `,
    `${appName_1.appName} log abc-123 1h15m `,
    `${appName_1.appName} log abc-123 11-14`,
    `${appName_1.appName} log abc-123 11-14:30`,
    `${appName_1.appName} log abc-123 11:35-14:20 `,
    `${appName_1.appName} log abc-123 11.35-14.20 `,
    `${appName_1.appName} log abc-123 1h15m 2019-02-17`,
    `${appName_1.appName} log abc-123 1h15m y`,
    `${appName_1.appName} log abc-123 1h15m yesterday`,
    `${appName_1.appName} log abc-123 1h15m -d "worklog description"`,
    `${appName_1.appName} log abc-123 1h15m --start 10:30`,
    `${appName_1.appName} log abc-123 1h15m -s 9`
];
Log.aliases = ['l'];
Log.flags = {
    help: command_1.flags.help({ char: 'h' }),
    debug: command_1.flags.boolean(),
    description: command_1.flags.string({
        char: 'd',
        description: 'worklog description'
    }),
    start: command_1.flags.string({
        char: 's',
        description: 'start time (HH:mm format), used when the input is a duration'
    }),
    'remaining-estimate': command_1.flags.string({
        char: 'r',
        description: 'remaining estimate'
    })
};
Log.args = [
    {
        name: 'issue_key_or_alias',
        description: 'issue key, like abc-123 or alias',
        required: true
    },
    {
        name: 'duration_or_interval',
        description: 'worklog duration (e.g 15m) or interval (e.g 11:30-14)',
        required: true
    },
    {
        name: 'type',
        description: 'worklog type like Development or Generaladministration',
        required: true
    },
    {
        name: 'when',
        description: trimIndent_1.trimIndent(`date to add worklog, defaulted to today
      * date in YYYY-MM-DD format
      * y as yesterday`),
        required: false
    }
];
//# sourceMappingURL=log.js.map