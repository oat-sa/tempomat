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
const cli_table3_1 = __importDefault(require("cli-table3"));
const date_fns_1 = require("date-fns");
const chalk_1 = __importDefault(require("chalk"));
const issueKeyExtended_1 = __importStar(require("../issueKeyExtended"));
function render(tracker, now) {
    return __awaiter(this, void 0, void 0, function* () {
        const table = new cli_table3_1.default();
        const infoHeaders = yield generateInfoHeaders(tracker);
        const intervalHeaders = generateIntervalHeaders();
        const intervalsContent = generateIntervalsContent(tracker.intervals);
        const summaryFooter = generateSummaryFooter(tracker, now);
        table.push(...infoHeaders, intervalHeaders, ...intervalsContent, summaryFooter);
        return table;
    });
}
exports.render = render;
function generateInfoHeaders(tracker) {
    return __awaiter(this, void 0, void 0, function* () {
        const issueKey = yield issueKeyExtended_1.default(tracker.issueKey, issueKeyExtended_1.AliasesPosition.Right);
        const trackerIdContent = `Tracker for ${issueKey}, ${toString(tracker.isActive)}`;
        const trackerIdRow = [{ colSpan: 3, content: chalk_1.default.bold(trackerIdContent), hAlign: 'center' }];
        const descriptionRow = tracker.description ? [{ colSpan: 3, content: chalk_1.default.bold(`${tracker.description}`), hAlign: 'center' }] : [];
        const trackerResumedAtContent = `Last resume time: ${date_fns_1.lightFormat(tracker.activeTimestamp, 'yyyy-MM-dd HH:mm')}`;
        const trackerResumedAtRow = [{ colSpan: 3, content: chalk_1.default.bold(trackerResumedAtContent), hAlign: 'center' }];
        return [
            trackerIdRow,
            descriptionRow,
            trackerResumedAtRow
        ].filter(row => row.length !== 0).map(row => row);
    });
}
function toString(isActive) {
    return isActive ? 'Active' : 'INACTIVE';
}
function generateIntervalHeaders() {
    return [
        { content: chalk_1.default.bold.greenBright('started at'), hAlign: 'right' },
        { content: chalk_1.default.bold.greenBright('stopped at'), hAlign: 'right' },
        { content: chalk_1.default.bold.greenBright('duration'), hAlign: 'right' }
    ].map(row => row);
}
function generateIntervalsContent(intervals) {
    return toRows(intervals).map(row => row);
}
function toRows(intervals) {
    if (intervals.length === 0) {
        return [[{ colSpan: 3, content: chalk_1.default.redBright('No intervals'), hAlign: 'center' }]];
    }
    return intervals.map(interval => {
        const duration = date_fns_1.differenceInMinutes(interval.end, interval.start);
        const startedAt = date_fns_1.lightFormat(interval.start, 'yyyy-MM-dd HH:mm:ss');
        const stoppedAt = date_fns_1.lightFormat(interval.end, 'yyyy-MM-dd HH:mm:ss');
        const row = {
            startedAt: { colSpan: 1, content: startedAt, hAlign: 'right' },
            stoppedAt: { colSpan: 1, content: stoppedAt, hAlign: 'right' },
            duration: { colSpan: 1, content: `${duration}m`, hAlign: 'right' }
        };
        return Object.values(row);
    });
}
function generateSummaryFooter(tracker, now) {
    const intervalsDuration = tracker.intervals
        .map(interval => date_fns_1.differenceInMinutes(interval.end, interval.start))
        .reduce((previous, current) => previous + current, 0);
    let activeDuration = 0;
    if (tracker.isActive) {
        activeDuration = date_fns_1.differenceInMinutes(now.getTime(), tracker.activeTimestamp);
    }
    const totalDuration = intervalsDuration + activeDuration;
    return [
        { colSpan: 2, content: 'Total duration:', hAlign: 'right' },
        { colSpan: 1, content: `${totalDuration}m`, hAlign: 'right' }
    ].map(row => row);
}
//# sourceMappingURL=trackersTable.js.map