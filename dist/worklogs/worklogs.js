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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../api/api"));
const timeParser = __importStar(require("./timeParser"));
const time_1 = __importDefault(require("../time"));
const date_fns_1 = require("date-fns");
const schedule = __importStar(require("./schedule"));
const appName_1 = require("../appName");
const authenticator_1 = __importDefault(require("../config/authenticator"));
const aliases_1 = __importDefault(require("../config/aliases"));
const DATE_FORMAT = 'yyyy-MM-dd';
const START_TIME_FORMAT = 'HH:mm:ss';
const YESTERDAY_LITERALS = ['y', 'yesterday'];
const TODAY_LITERALS = ['t', 'today'];
const TODAY_REFERENCE_REGEX = RegExp(`^(${TODAY_LITERALS.join('|')})[-+][0-9]+$`);
exports.default = {
    addWorklog(input, attributes) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield checkToken();
            const referenceDate = parseWhenArg(time_1.default.now(), input.when);
            const parseResult = timeParser.parse(input.durationOrInterval, referenceDate);
            if (parseResult == null) {
                throw Error(`Error parsing "${input.durationOrInterval}". Try something like 1h10m or 11-12:30. See ${appName_1.appName} log --help for more examples.`);
            }
            if (parseResult.seconds <= 0) {
                throw Error('Error. Minutes worked must be larger than 0.');
            }
            const issueKey = (_a = yield aliases_1.default.getIssueKey(input.issueKeyOrAlias), (_a !== null && _a !== void 0 ? _a : input.issueKeyOrAlias));
            const worklogEntity = yield api_1.default.addWorklog({
                issueKey: issueKey,
                timeSpentSeconds: parseResult.seconds,
                startDate: date_fns_1.format(referenceDate, DATE_FORMAT),
                startTime: startTime(parseResult, input.startTime, referenceDate),
                description: input.description,
                remainingEstimateSeconds: remainingEstimateSeconds(referenceDate, input.remainingEstimate),
                attributes
            });
            return toWorklog(worklogEntity);
        });
    },
    deleteWorklog(worklogIdInput) {
        return __awaiter(this, void 0, void 0, function* () {
            yield checkToken();
            const worklogId = parseInt(worklogIdInput);
            if (!Number.isInteger(worklogId)) {
                throw Error('Error. Worklog id should be an integer number.');
            }
            const worklogEntity = yield api_1.default.getWorklog(worklogId);
            const worklog = toWorklog(worklogEntity);
            yield api_1.default.deleteWorklog(worklogId);
            return worklog;
        });
    },
    getUserWorklogs(when) {
        return __awaiter(this, void 0, void 0, function* () {
            yield checkToken();
            const credentials = yield authenticator_1.default.getCredentials();
            const now = time_1.default.now();
            const date = parseWhenArg(now, when);
            const formattedDate = date_fns_1.format(date, DATE_FORMAT);
            const monthStart = date_fns_1.format(date_fns_1.startOfMonth(date), DATE_FORMAT);
            const monthEnd = date_fns_1.format(date_fns_1.endOfMonth(date), DATE_FORMAT);
            const [worklogsResponse, scheduleResponse] = yield Promise.all([
                api_1.default.getWorklogs({ fromDate: monthStart, toDate: monthEnd }),
                api_1.default.getUserSchedule({ fromDate: monthStart, toDate: monthEnd })
            ]);
            const worklogs = yield generateWorklogs(worklogsResponse, formattedDate);
            const scheduleDetails = schedule.createScheduleDetails(worklogsResponse.results, scheduleResponse.results, formattedDate, credentials.accountId);
            return { worklogs, date, scheduleDetails };
        });
    }
};
function remainingEstimateSeconds(referenceDate, remainingEstimate) {
    if (remainingEstimate) {
        const result = timeParser.parse(remainingEstimate, referenceDate);
        if (result == null) {
            throw Error(`Error parsing "${remainingEstimate}". Try something like 1h. See ${appName_1.appName} log --help for more examples.`);
        }
        return result.seconds;
    }
    return undefined;
}
function generateWorklogs(worklogsResponse, formattedDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield authenticator_1.default.getCredentials();
        return worklogsResponse.results
            .filter((e) => e.author.accountId === credentials.accountId && e.startDate === formattedDate)
            .map((e) => toWorklog(e));
    });
}
function toWorklog(entity) {
    var _a, _b;
    const referenceDate = date_fns_1.parse(entity.startDate, DATE_FORMAT, time_1.default.now());
    return {
        id: entity.tempoWorklogId,
        interval: (_a = timeParser.toInterval(entity.timeSpentSeconds, entity.startTime, referenceDate), (_a !== null && _a !== void 0 ? _a : undefined)),
        issueKey: entity.issue.key,
        duration: (_b = timeParser.toDuration(entity.timeSpentSeconds), (_b !== null && _b !== void 0 ? _b : 'unknown')),
        description: entity.description,
        link: generateLink(entity.issue)
    };
}
function checkToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const isTokenSet = yield authenticator_1.default.hasTempoToken();
        if (!isTokenSet) {
            throw Error('Tempo token not set. Setup tempomat by `tempo setup` command.');
        }
    });
}
function parseWhenArg(now, when) {
    if (when === undefined)
        return now;
    if (YESTERDAY_LITERALS.includes(when)) {
        const nowAtMidnight = new Date(now);
        nowAtMidnight.setHours(0, 0, 0, 0);
        return date_fns_1.addDays(nowAtMidnight, -1);
    }
    if (when.match(TODAY_REFERENCE_REGEX)) {
        const nowAtMidnight = new Date(now);
        nowAtMidnight.setHours(0, 0, 0, 0);
        return date_fns_1.addDays(nowAtMidnight, parseInt(when.replace(/[^\d+-]/g, '')));
    }
    const date = date_fns_1.parse(when, DATE_FORMAT, new Date());
    if (date_fns_1.isValid(date)) {
        return date;
    }
    else {
        throw Error(`Cannot parse "${when}" to valid date. Try to use YYYY-MM-DD format. See ${appName_1.appName} --help for more examples.`);
    }
}
function startTime(parseResult, inputStartTime, referenceDate) {
    if (parseResult.startTime) {
        if (inputStartTime)
            console.log(`Start time param is ignored, ${parseResult.startTime} is used instead.`);
        return parseResult.startTime;
    }
    if (inputStartTime)
        return parseStartTime(inputStartTime, referenceDate);
    return date_fns_1.format(referenceDate, START_TIME_FORMAT);
}
function parseStartTime(startTime, referenceDate) {
    const parsedTime = timeParser.parseTime(startTime, referenceDate);
    if (parsedTime) {
        return date_fns_1.format(parsedTime, START_TIME_FORMAT);
    }
    else {
        throw Error(`Cannot parse ${startTime} to valid start time. Try to use HH:mm format. See ${appName_1.appName} --help for more examples.`);
    }
}
function generateLink(issue) {
    const url = new URL(issue.self);
    return `https://${url.hostname}/browse/${issue.key}`;
}
//# sourceMappingURL=worklogs.js.map