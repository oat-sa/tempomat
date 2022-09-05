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
class List extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args, flags } = this.parse(List);
            globalFlags_1.default.debug = flags.debug;
            yield tempo_1.default.listUserWorklogs(args.when, flags.verbose);
        });
    }
}
exports.default = List;
List.description = '[or ls], print worklogs from provided date (YYYY-MM-DD or \'y\' as yesterday)';
List.examples = [
    `${appName_1.appName} list`,
    `${appName_1.appName} ls`,
    `${appName_1.appName} list y `,
    `${appName_1.appName} list yesterday `,
    `${appName_1.appName} list 2020-02-17`,
    `${appName_1.appName} list -v`
];
List.aliases = ['ls'];
List.flags = {
    help: command_1.flags.help({ char: 'h' }),
    debug: command_1.flags.boolean(),
    verbose: command_1.flags.boolean({
        char: 'v',
        description: 'verbose output with description and task link'
    })
};
List.args = [{
        name: 'when',
        description: trimIndent_1.trimIndent(`date to fetch worklogs, defaulted to today
    * date in YYYY-MM-DD format
    * y as yesterday`),
        required: false
    }];
//# sourceMappingURL=list.js.map