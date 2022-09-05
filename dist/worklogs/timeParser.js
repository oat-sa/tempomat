"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
function parse(durationOrInterval, referenceDate) {
    var _a;
    return _a = parseDuration(durationOrInterval), (_a !== null && _a !== void 0 ? _a : parseInterval(durationOrInterval, referenceDate));
}
exports.parse = parse;
function toInterval(seconds, startTime, referenceDate) {
    if (seconds < 0)
        return null;
    const parsedStartTime = date_fns_1.parse(startTime, 'HH:mm:ss', referenceDate);
    if (date_fns_1.isValid(parsedStartTime)) {
        const startTime = date_fns_1.format(parsedStartTime, 'HH:mm');
        const endTime = date_fns_1.format(date_fns_1.addSeconds(parsedStartTime, seconds), 'HH:mm');
        return {
            startTime: startTime,
            endTime: endTime
        };
    }
    else {
        return null;
    }
}
exports.toInterval = toInterval;
function toDuration(seconds, plusPrefix = false) {
    const hours = Math.floor(Math.abs(seconds) / 3600);
    const minutes = Math.floor((Math.abs(seconds) % 3600) / 60);
    if (!hours && !minutes)
        return '0h';
    let duration = '';
    if (seconds < 0)
        duration += '-';
    if (seconds > 0 && plusPrefix)
        duration += '+';
    if (hours)
        duration += `${hours}h`;
    if (minutes)
        duration += `${minutes}m`;
    return duration;
}
exports.toDuration = toDuration;
function parseDuration(input) {
    var _a, _b;
    const durationPattern = /^(?:([0-9]+)(?:h|H))?(?:([0-9]+)(?:m|M))?$/g;
    const durationGroups = durationPattern.exec(input);
    const durationGroup1 = (_a = durationGroups) === null || _a === void 0 ? void 0 : _a[1];
    const durationGroup2 = (_b = durationGroups) === null || _b === void 0 ? void 0 : _b[2];
    if (durationGroup1 || durationGroup2) {
        const hours = parseInt((durationGroup1 !== null && durationGroup1 !== void 0 ? durationGroup1 : '0'));
        const minutes = parseInt((durationGroup2 !== null && durationGroup2 !== void 0 ? durationGroup2 : '0'));
        return {
            seconds: hours * 3600 + minutes * 60,
            startTime: undefined
        };
    }
    else {
        return null;
    }
}
function parseInterval(input, referenceDate) {
    const interval = input.split('-');
    if (interval.length !== 2)
        return null;
    const from = interval[0];
    const to = interval[1];
    const seconds = intervalToSeconds(from, to, referenceDate);
    const start = parseTime(from, referenceDate);
    if (seconds == null || start == null)
        return null;
    return {
        seconds: seconds,
        startTime: date_fns_1.format(start, 'HH:mm:ss')
    };
}
function intervalToSeconds(startTime, endTime, referenceDate) {
    var start = parseTime(startTime, referenceDate);
    var end = parseTime(endTime, referenceDate);
    if (!start || !end)
        return null;
    const diff = date_fns_1.differenceInSeconds(end, start);
    if (date_fns_1.isAfter(end, start)) {
        return diff;
    }
    else {
        const dayInSeconds = 86400;
        return dayInSeconds + diff;
    }
}
function parseTime(time, referenceDate) {
    var _a, _b, _c, _d, _e;
    return _e = (_d = (_c = (_b = (_a = validDateOrNull(date_fns_1.parse(time, 'HH', referenceDate)), (_a !== null && _a !== void 0 ? _a : validDateOrNull(date_fns_1.parse(time, 'HH:mm', referenceDate)))), (_b !== null && _b !== void 0 ? _b : validDateOrNull(date_fns_1.parse(time, 'H:mm', referenceDate)))), (_c !== null && _c !== void 0 ? _c : validDateOrNull(date_fns_1.parse(time, 'HH.mm', referenceDate)))), (_d !== null && _d !== void 0 ? _d : validDateOrNull(date_fns_1.parse(time, 'H.mm', referenceDate)))), (_e !== null && _e !== void 0 ? _e : validDateOrNull(date_fns_1.parse(time, 'H', referenceDate)));
}
exports.parseTime = parseTime;
function validDateOrNull(date) {
    if (date_fns_1.isValid(date)) {
        return date;
    }
    else {
        return null;
    }
}
//# sourceMappingURL=timeParser.js.map