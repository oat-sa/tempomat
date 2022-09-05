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
const authenticator_1 = __importDefault(require("../config/authenticator"));
const tempoAxios_1 = __importDefault(require("./tempoAxios"));
const globalFlags_1 = __importDefault(require("../globalFlags"));
const appName_1 = require("../appName");
exports.default = {
    addWorklog(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield authenticator_1.default.getCredentials();
            const body = Object.assign(Object.assign({}, request), { authorAccountId: credentials.accountId });
            return execute(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield tempoAxios_1.default.post('/worklogs', body);
                debugLog(response);
                return response.data;
            }));
        });
    },
    deleteWorklog(worklogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return execute(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield tempoAxios_1.default.delete(`/worklogs/${worklogId}`);
                debugLog(response);
            }));
        });
    },
    getWorklog(worklogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return execute(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield tempoAxios_1.default.get(`/worklogs/${worklogId}`);
                debugLog(response);
                return response.data;
            }));
        });
    },
    getWorklogs(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield authenticator_1.default.getCredentials();
            return execute(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield tempoAxios_1.default.get(`/worklogs/user/${credentials.accountId}`, {
                    params: { from: request.fromDate, to: request.toDate, limit: 1000 }
                });
                debugLog(response);
                const allResults = yield fetchPaginatedResults(response.data.results, response);
                return { results: allResults };
            }));
        });
    },
    getUserSchedule(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return execute(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield tempoAxios_1.default.get('/user-schedule', {
                    params: { from: request.fromDate, to: request.toDate }
                });
                debugLog(response);
                return {
                    results: response.data.results
                };
            }));
        });
    }
};
function fetchPaginatedResults(acc, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const nextPageUrl = response.data.metadata.next;
        if (nextPageUrl) {
            const response = yield tempoAxios_1.default.get(nextPageUrl);
            debugLog(response);
            const nextPageResults = yield fetchPaginatedResults(response.data.results, response);
            return acc.concat(nextPageResults);
        }
        else {
            return acc;
        }
    });
}
function debugLog(response) {
    if (globalFlags_1.default.debug) {
        console.log(`Request: ${JSON.stringify(response.config)}, Response: ${JSON.stringify(response.data)}`);
    }
}
function execute(action) {
    return __awaiter(this, void 0, void 0, function* () {
        return action().catch((e) => handleError(e));
    });
}
function handleError(e) {
    var _a, _b, _c, _d, _e;
    if (globalFlags_1.default.debug)
        console.log(`Response: ${JSON.stringify((_a = e.response) === null || _a === void 0 ? void 0 : _a.data)}`);
    const responseStatus = (_b = e.response) === null || _b === void 0 ? void 0 : _b.status;
    if (responseStatus === 401) {
        throw Error(`Unauthorized access. Token is invalid or has expired. Run ${appName_1.appName} setup to configure access.`);
    }
    const errorMessages = (_e = (_d = (_c = e.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.errors) === null || _e === void 0 ? void 0 : _e.map((err) => err.message);
    if (errorMessages) {
        throw Error(`Failure. Reason: ${e.message}. Errors: ${errorMessages.join(', ')}`);
    }
    else {
        if (globalFlags_1.default.debug)
            console.log(e.toJSON());
        let errorMessage = 'Error connecting to server.';
        if (responseStatus)
            errorMessage += ` Server status code: ${responseStatus}.`;
        throw Error(errorMessage);
    }
}
//# sourceMappingURL=api.js.map