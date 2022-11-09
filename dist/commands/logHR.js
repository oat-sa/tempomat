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
class LogHR extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args, flags } = this.parse(LogHR);
            globalFlags_1.default.debug = flags.debug;
            yield tempo_1.default.addWorklog({
                issueKeyOrAlias: 'HR',
                durationOrInterval: '1m',
                when: flags.when,
                description: 'Daily total working time log'
            }, [
                {
                    value: args.duration,
                    key: '_NormalDuration_'
                },
                {
                    value: args.end,
                    key: '_To_'
                },
                {
                    value: args.start,
                    key: '_From_'
                },
                {
                    value: args.flex || '0',
                    key: '_Flextime_'
                },
                {
                    value: 'Generaladministration',
                    key: '_Type_'
                }
            ]);
        });
    }
}
exports.default = LogHR;
LogHR.description = 'Log daily working time';
LogHR.examples = [
    `${appName_1.appName} logHR 07:00 16:00 8.0 0.5`,
    `${appName_1.appName} logHR 07:00 16:00 8.0`
];
LogHR.aliases = ['hr'];
LogHR.flags = {
    help: command_1.flags.help({ char: 'h' }),
    debug: command_1.flags.boolean(),
    when: command_1.flags.string({
        char: 'w',
        description: 'date in YYYY-MM-DD format'
    })
};
LogHR.args = [
    {
        name: 'start',
        description: 'start like 07:00',
        required: true
    },
    {
        name: 'end',
        description: 'end like 17:00',
        required: true
    },
    {
        name: 'duration',
        description: 'duration, like 8.0',
        required: true
    },
    {
        name: 'flex',
        description: 'flex, like 0.5',
        required: false
    }
];
//# sourceMappingURL=logHR.js.map