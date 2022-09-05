"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timeParser = __importStar(require("./timeParser"));
const lodash_1 = __importDefault(require("lodash"));
const time_1 = __importDefault(require("../time"));
const date_fns_1 = require("date-fns");
const DATE_FORMAT = 'yyyy-MM-dd';
function createScheduleDetails(worklogsResults, scheduleResults, formattedSelectedDate, accountId) {
    const now = time_1.default.now();
    const formattedNowDate = date_fns_1.format(now, DATE_FORMAT);
    const userAccountWorklogs = worklogsResults
        .filter((e) => e.author.accountId === accountId);
    const dayWorklogResults = userAccountWorklogs
        .filter((e) => e.startDate === formattedSelectedDate && e.author.accountId === accountId);
    const dayScheduleResults = scheduleResults.filter((e) => e.date === formattedSelectedDate);
    const daysToTodayScheduleResults = scheduleResults
        .filter((e) => e.date === formattedNowDate || date_fns_1.isBefore(date_fns_1.parse(e.date, DATE_FORMAT, new Date()), now));
    const monthRequiredSeconds = lodash_1.default.sumBy(scheduleResults, (r) => r.requiredSeconds);
    const monthLoggedSeconds = lodash_1.default.sumBy(userAccountWorklogs, (r) => r.timeSpentSeconds);
    const monthCurrentPeriodSeconds = monthLoggedSeconds - lodash_1.default.sumBy(daysToTodayScheduleResults, (r) => r.requiredSeconds);
    const dayRequiredSeconds = lodash_1.default.sumBy(dayScheduleResults, (r) => r.requiredSeconds);
    const dayLoggedSeconds = lodash_1.default.sumBy(dayWorklogResults, (r) => r.timeSpentSeconds);
    return {
        monthRequiredDuration: timeParser.toDuration(monthRequiredSeconds),
        monthLoggedDuration: timeParser.toDuration(monthLoggedSeconds),
        monthCurrentPeriodDuration: timeParser.toDuration(monthCurrentPeriodSeconds, true),
        dayRequiredDuration: timeParser.toDuration(dayRequiredSeconds),
        dayLoggedDuration: timeParser.toDuration(dayLoggedSeconds)
    };
}
exports.createScheduleDetails = createScheduleDetails;
//# sourceMappingURL=schedule.js.map