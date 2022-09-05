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
const aliases_1 = __importDefault(require("./config/aliases"));
const cli_truncate_1 = __importDefault(require("cli-truncate"));
const chalk_1 = __importDefault(require("chalk"));
var AliasesPosition;
(function (AliasesPosition) {
    AliasesPosition[AliasesPosition["Left"] = 0] = "Left";
    AliasesPosition[AliasesPosition["Right"] = 1] = "Right";
})(AliasesPosition = exports.AliasesPosition || (exports.AliasesPosition = {}));
function issueKeyExtended(issueKey, aliasesPosition) {
    return __awaiter(this, void 0, void 0, function* () {
        const aliasNames = yield aliases_1.default.getAliasNames(issueKey);
        const issueKeyText = chalk_1.default.bold(issueKey);
        if (aliasNames.length === 0)
            return issueKeyText;
        const aliasesText = chalk_1.default.gray(getAliasesText(aliasNames));
        switch (aliasesPosition) {
            case AliasesPosition.Left:
                return `${aliasesText} ${issueKeyText}`;
            case AliasesPosition.Right:
                return `${issueKeyText} ${aliasesText}`;
        }
    });
}
exports.default = issueKeyExtended;
function getAliasesText(aliasNames) {
    const aliasesLength = aliasNames.length;
    const firstAlias = aliasNames[0];
    let moreContent = '';
    if (aliasesLength > 1) {
        moreContent = `, +${aliasesLength - 1}`;
    }
    return `(${cli_truncate_1.default(firstAlias, 17)}${moreContent})`;
}
//# sourceMappingURL=issueKeyExtended.js.map