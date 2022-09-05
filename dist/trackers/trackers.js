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
const aliases_1 = __importDefault(require("../config/aliases"));
const trackerStore_1 = __importDefault(require("../config/trackerStore"));
exports.default = {
    findTracker(issueKeyOrAlias) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const issueKey = (_a = yield aliases_1.default.getIssueKey(issueKeyOrAlias), (_a !== null && _a !== void 0 ? _a : issueKeyOrAlias));
            return trackerStore_1.default.getTracker(issueKey);
        });
    },
    startTracker(input) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const issueKey = (_a = yield aliases_1.default.getIssueKey(input.issueKeyOrAlias), (_a !== null && _a !== void 0 ? _a : input.issueKeyOrAlias));
            return trackerStore_1.default.createTracker({
                issueKey: issueKey,
                description: input.description,
                startTime: input.now.getTime()
            });
        });
    },
    resumeTracker(input) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const issueKey = (_a = yield aliases_1.default.getIssueKey(input.issueKeyOrAlias), (_a !== null && _a !== void 0 ? _a : input.issueKeyOrAlias));
            const tracker = yield trackerStore_1.default.getTracker(issueKey);
            if (!tracker) {
                return undefined;
            }
            let activeTimestamp = tracker.activeTimestamp;
            if (!tracker.isActive) {
                activeTimestamp = input.now.getTime();
            }
            const updatedTracker = {
                issueKey: issueKey,
                description: tracker.description,
                activeTimestamp: activeTimestamp,
                isActive: true,
                intervals: tracker.intervals
            };
            return trackerStore_1.default.putTracker(updatedTracker);
        });
    },
    pauseTracker(input) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const issueKey = (_a = yield aliases_1.default.getIssueKey(input.issueKeyOrAlias), (_a !== null && _a !== void 0 ? _a : input.issueKeyOrAlias));
            const tracker = yield trackerStore_1.default.getTracker(issueKey);
            if (!tracker) {
                return undefined;
            }
            let newIntervals = tracker.intervals;
            if (tracker.isActive) {
                const duration = input.now.getTime() - tracker.activeTimestamp;
                if (duration >= ONE_MINUTE_IN_MS) {
                    newIntervals = newIntervals.concat({
                        start: tracker.activeTimestamp,
                        end: input.now.getTime()
                    });
                }
            }
            const updatedTracker = {
                issueKey: issueKey,
                description: tracker.description,
                activeTimestamp: tracker.activeTimestamp,
                isActive: false,
                intervals: newIntervals
            };
            return trackerStore_1.default.putTracker(updatedTracker);
        });
    },
    stopTracker(input) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const tracker = yield this.pauseTracker({
                issueKeyOrAlias: input.issueKeyOrAlias,
                now: input.now
            });
            if (tracker) {
                return trackerStore_1.default.putTracker({
                    issueKey: tracker.issueKey,
                    description: (_b = (_a = input) === null || _a === void 0 ? void 0 : _a.description, (_b !== null && _b !== void 0 ? _b : tracker.description)),
                    activeTimestamp: tracker.activeTimestamp,
                    isActive: false,
                    intervals: tracker.intervals
                });
            }
            return tracker;
        });
    },
    deleteTracker(input) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const issueKey = (_a = yield aliases_1.default.getIssueKey(input.issueKeyOrAlias), (_a !== null && _a !== void 0 ? _a : input.issueKeyOrAlias));
            return trackerStore_1.default.removeTracker(issueKey);
        });
    },
    removeInterval(tracker, interval) {
        return __awaiter(this, void 0, void 0, function* () {
            const newIntervals = tracker.intervals.filter(it => it !== interval);
            return trackerStore_1.default.putTracker({
                issueKey: tracker.issueKey,
                description: tracker.description,
                activeTimestamp: tracker.activeTimestamp,
                isActive: tracker.isActive,
                intervals: newIntervals
            });
        });
    },
    getTrackers() {
        return __awaiter(this, void 0, void 0, function* () {
            return trackerStore_1.default.getTrackers();
        });
    }
};
const ONE_MINUTE_IN_MS = 60 * 1000;
//# sourceMappingURL=trackers.js.map