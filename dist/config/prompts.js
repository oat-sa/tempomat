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
const cli_ux_1 = __importDefault(require("cli-ux"));
const trimIndent_1 = require("../trimIndent");
exports.default = {
    promptCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            const profileInfo = yield promptProfileInfo();
            const tempoToken = yield promptTempoToken(profileInfo.hostname);
            if (!tempoToken)
                throw Error('Failure. Tempo token wasn\'t set properly.');
            return {
                tempoToken: tempoToken,
                accountId: profileInfo.accountId
            };
        });
    }
};
function promptProfileInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = yield cli_ux_1.default.prompt(trimIndent_1.trimIndent(`
    Step 1/2:
    Enter URL to your Jira profile. (Needed to get your account id and domain name) 
    1. Click on your avatar on the Jira navigation header
    2. Click on the "profile" option
    3. Copy an URL and paste here:
    `));
        const profileInfo = extractProfileInfo(input);
        if (profileInfo.hostname.length > 0 && profileInfo.accountId.length > 0) {
            return profileInfo;
        }
        else {
            throw Error('Can\'t parse profile URL');
        }
    });
}
function promptTempoToken(hostname) {
    return __awaiter(this, void 0, void 0, function* () {
        const tempoConfigurationUrl = `https://${hostname}/plugins/servlet/ac/io.tempo.jira/tempo-app#!/configuration/api-integration`;
        cli_ux_1.default.open(tempoConfigurationUrl);
        const input = yield cli_ux_1.default.prompt(trimIndent_1.trimIndent(`
    Step 2/2:
    That's almost everything! Enter your tempo token. You can generate it here: 
    ${tempoConfigurationUrl} 
    (this page should open automatically in your browser)
    `), { type: 'hide' });
        return input;
    });
}
function extractProfileInfo(profileUrl) {
    const url = new URL(profileUrl);
    return {
        accountId: url.pathname.split('/').slice(-1)[0],
        hostname: url.hostname
    };
}
//# sourceMappingURL=prompts.js.map