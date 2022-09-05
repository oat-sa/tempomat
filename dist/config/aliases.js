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
const configStore_1 = __importDefault(require("./configStore"));
exports.default = {
    getIssueKey(aliasName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield configStore_1.default.read();
            return (_a = config.aliases) === null || _a === void 0 ? void 0 : _a.get(aliasName);
        });
    },
    getAliasNames(issueKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield configStore_1.default.read();
            if (!config.aliases)
                return [];
            const entries = Array.from(config.aliases.entries()).filter(entry => {
                return entry[1].toUpperCase() === issueKey.toUpperCase();
            });
            const aliases = entries.map(value => value[0]);
            return aliases;
        });
    },
    set(aliasName, issueKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield configStore_1.default.read();
            if (!config.aliases) {
                config.aliases = new Map();
            }
            /* eslint-disable no-unused-expressions */
            config.aliases.set(aliasName, issueKey);
            yield configStore_1.default.save(config);
        });
    },
    delete(aliasName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield configStore_1.default.read();
            /* eslint-disable no-unused-expressions */
            (_a = config.aliases) === null || _a === void 0 ? void 0 : _a.delete(aliasName);
            yield configStore_1.default.save(config);
        });
    },
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield configStore_1.default.read();
            return config.aliases;
        });
    }
};
//# sourceMappingURL=aliases.js.map