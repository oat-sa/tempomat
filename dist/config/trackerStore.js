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
    createTracker(newTracker) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.getTracker(newTracker.issueKey)) {
                return undefined;
            }
            const config = yield configStore_1.default.read();
            if (!config.trackers) {
                config.trackers = new Map();
            }
            const tracker = {
                issueKey: newTracker.issueKey,
                description: newTracker.description,
                activeTimestamp: newTracker.startTime,
                isActive: true,
                intervals: []
            };
            config.trackers.set(newTracker.issueKey, tracker);
            yield configStore_1.default.save(config);
            return tracker;
        });
    },
    getTracker(issueKey) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield configStore_1.default.read();
            return (_a = config.trackers) === null || _a === void 0 ? void 0 : _a.get(issueKey);
        });
    },
    putTracker(tracker) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield configStore_1.default.read();
            if (!config.trackers) {
                config.trackers = new Map();
            }
            config.trackers.set(tracker.issueKey, tracker);
            yield configStore_1.default.save(config);
            return tracker;
        });
    },
    removeTracker(issueKey) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const tracker = yield this.getTracker(issueKey);
            if (!tracker) {
                return undefined;
            }
            const config = yield configStore_1.default.read();
            if (!((_a = config.trackers) === null || _a === void 0 ? void 0 : _a.delete(issueKey))) {
                return undefined;
            }
            yield configStore_1.default.save(config);
            return tracker;
        });
    },
    getTrackers() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield configStore_1.default.read();
            const trackers = (_a = config.trackers) === null || _a === void 0 ? void 0 : _a.values();
            return trackers ? [...trackers] : [];
        });
    }
};
//# sourceMappingURL=trackerStore.js.map