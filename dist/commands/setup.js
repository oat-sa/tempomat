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
class Setup extends command_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield tempo_1.default.setup();
        });
    }
}
exports.default = Setup;
Setup.description = 'setup cli, this is required before the first use';
Setup.examples = [
    `${appName_1.appName} setup`
];
//# sourceMappingURL=setup.js.map