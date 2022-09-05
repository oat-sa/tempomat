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
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const readFileAsync = util_1.promisify(fs_1.default.readFile);
const writeFileAsync = util_1.promisify(fs_1.default.writeFile);
function configFilePath() {
    return path_1.default.join(os_1.default.homedir(), '.tempomat');
}
exports.configFilePath = configFilePath;
exports.default = {
    save(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const configPath = configFilePath();
            const configJson = JSON.stringify(config, replacer);
            yield writeFileAsync(configPath, configJson, { mode: 0o600 });
        });
    },
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const configPath = configFilePath();
                const configJson = yield readFileAsync(configPath, { encoding: 'utf8' });
                return JSON.parse(configJson, reviver);
            }
            catch (e) {
                return {
                    tempoToken: undefined,
                    accountId: undefined,
                    aliases: undefined,
                    trackers: undefined
                };
            }
        });
    }
};
function replacer(key, value) {
    const originalObject = this[key];
    if (originalObject instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(originalObject.entries())
        };
    }
    else {
        return value;
    }
}
function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}
//# sourceMappingURL=configStore.js.map