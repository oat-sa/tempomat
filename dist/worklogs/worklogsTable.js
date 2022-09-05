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
const cli_truncate_1 = __importDefault(require("cli-truncate"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const date_fns_1 = require("date-fns");
const chalk_1 = __importDefault(require("chalk"));
const issueKeyExtended_1 = __importStar(require("../issueKeyExtended"));
// How many columns should be removed, when verbose mode is off
const COLUMNS_TO_REMOVE = 2;
function render(userWorklogs, verbose = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const { worklogHeaders, columnsNumber } = generateWorklogHeaders(verbose);
        const infoHeaders = generateInfoHeaders(userWorklogs, verbose, columnsNumber);
        const content = yield generateContent(userWorklogs.worklogs, verbose, columnsNumber);
        const summaryFooter = generateDurationSummaryFooter(userWorklogs);
        const table = new cli_table3_1.default();
        table.push(...infoHeaders, worklogHeaders, ...content, summaryFooter);
        return table;
    });
}
exports.render = render;
function generateWorklogHeaders(verbose) {
    const headers = [
        { content: chalk_1.default.bold.greenBright('id'), hAlign: 'right' },
        { content: chalk_1.default.bold.greenBright('from-to'), hAlign: 'right' },
        { content: chalk_1.default.bold.greenBright('issue'), hAlign: 'right' },
        { content: chalk_1.default.bold.greenBright('duration'), hAlign: 'right' },
        chalk_1.default.bold.greenBright('description'),
        chalk_1.default.bold.greenBright('task url')
    ];
    if (!verbose) {
        headers.splice(headers.length - COLUMNS_TO_REMOVE, COLUMNS_TO_REMOVE);
    }
    return {
        worklogHeaders: headers.map((r) => r),
        columnsNumber: headers.length
    };
}
function generateInfoHeaders(userWorklogs, verbose, colSpan) {
    const details = userWorklogs.scheduleDetails;
    const monthProgress = `${details.monthLoggedDuration}/${details.monthRequiredDuration}`;
    const monthInfo = `${date_fns_1.format(userWorklogs.date, 'MMMM')}: ${monthProgress} (${details.monthCurrentPeriodDuration})`;
    const dateInfo = date_fns_1.format(userWorklogs.date, 'eeee, yyyy-MM-dd');
    return [
        [{ colSpan: colSpan, hAlign: 'center', content: chalk_1.default.bold(monthInfo) }],
        [{ colSpan: colSpan, hAlign: 'center', content: chalk_1.default.bold(dateInfo) }]
    ].map((r) => r);
}
function generateContent(worklogs, verbose, colSpan) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield generateWorklogsContent(worklogs);
        if (!verbose) {
            content.map(r => r.splice(r.length - COLUMNS_TO_REMOVE, COLUMNS_TO_REMOVE));
        }
        if (content.length === 0) {
            content = [
                [{ colSpan: colSpan, content: chalk_1.default.redBright('No worklogs'), hAlign: 'center' }]
            ];
        }
        return content.map((r) => r);
    });
}
function generateWorklogsContent(worklogs) {
    return __awaiter(this, void 0, void 0, function* () {
        const intervalRows = markBreaksBetweenIntervals(worklogs);
        return Promise.all(worklogs.map((worklog, index) => __awaiter(this, void 0, void 0, function* () {
            const issueKey = yield issueKeyExtended_1.default(worklog.issueKey, issueKeyExtended_1.AliasesPosition.Left);
            const tableContent = {
                id: { colSpan: 1, content: chalk_1.default.yellow(worklog.id), hAlign: 'right' },
                interval: { colSpan: 1, content: intervalRows[index], hAlign: 'right' },
                issueKey: { colSpan: 1, content: issueKey, hAlign: 'right' },
                duration: { colSpan: 1, content: worklog.duration, hAlign: 'right' },
                description: cli_truncate_1.default(worklog.description, 30),
                taskUrl: worklog.link
            };
            return Object.values(tableContent);
        })));
    });
}
function markBreaksBetweenIntervals(worklogs) {
    const intervals = worklogs.map(w => w.interval);
    return intervals.map((interval, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const next = intervals[index + 1];
        const previous = intervals[index - 1];
        let isStartTimeWithoutBreak = true;
        if (previous && ((_a = interval) === null || _a === void 0 ? void 0 : _a.startTime) !== ((_b = previous) === null || _b === void 0 ? void 0 : _b.endTime))
            isStartTimeWithoutBreak = false;
        let isEndTimeWithoutBreak = true;
        if (next && ((_c = interval) === null || _c === void 0 ? void 0 : _c.endTime) !== ((_d = next) === null || _d === void 0 ? void 0 : _d.startTime))
            isEndTimeWithoutBreak = false;
        const startTime = isStartTimeWithoutBreak ? (_e = interval) === null || _e === void 0 ? void 0 : _e.startTime : chalk_1.default.bold.redBright((_f = interval) === null || _f === void 0 ? void 0 : _f.startTime);
        const endTime = isEndTimeWithoutBreak ? (_g = interval) === null || _g === void 0 ? void 0 : _g.endTime : chalk_1.default.bold.redBright((_h = interval) === null || _h === void 0 ? void 0 : _h.endTime);
        return `${startTime}-${endTime}`;
    });
}
function generateDurationSummaryFooter(userWorklogs) {
    const details = userWorklogs.scheduleDetails;
    const requiredInfo = `Required ${details.dayRequiredDuration}, logged:`;
    const loggedDuration = `${chalk_1.default.yellow(details.dayLoggedDuration)}`;
    return [
        { colSpan: 3, content: requiredInfo, hAlign: 'right' },
        { colSpan: 1, content: loggedDuration, hAlign: 'right' }
    ].map((r) => r);
}
//# sourceMappingURL=worklogsTable.js.map