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
const authenticator_1 = __importDefault(require("./config/authenticator"));
const worklogs_1 = __importDefault(require("./worklogs/worklogs"));
const prompts_1 = __importDefault(require("./config/prompts"));
const worklogsTable = __importStar(require("./worklogs/worklogsTable"));
const chalk_1 = __importDefault(require("chalk"));
const appName_1 = require("./appName");
const trimIndent_1 = require("./trimIndent");
const cli_ux_1 = __importDefault(require("cli-ux"));
const aliases_1 = __importDefault(require("./config/aliases"));
const trackers_1 = __importDefault(require("./trackers/trackers"));
const trackersTable = __importStar(require("./trackers/trackersTable"));
const date_fns_1 = require("date-fns");
exports.default = {
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = yield prompts_1.default.promptCredentials();
                yield authenticator_1.default.saveCredentials(credentials);
                console.log(chalk_1.default.greenBright('Setup completed successfully. Use --help to list available commands.'));
                const aliasesCommand = chalk_1.default.bold.blue(`printf "alias tl='${appName_1.appName} l'\\nalias tls='${appName_1.appName} ls'\\nalias td='${appName_1.appName} d'" >> ~/.zshrc; source ~/.zshrc`);
                const autocompleteCommand = chalk_1.default.bold.blue('tempo autocomplete');
                console.log(trimIndent_1.trimIndent(`
            To set up autocomplete, run: 
            
            ${autocompleteCommand}
            
            Also consider adding following aliases to your shell for faster use:
            alias tl='${appName_1.appName} l'
            alias tls='${appName_1.appName} ls'
            alias td='${appName_1.appName} d'

            If you have zsh installed, just run:

            ${aliasesCommand}
            `));
            }
            catch (e) {
                showError(e);
            }
        });
    },
    addWorklog(input, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return execute(() => __awaiter(this, void 0, void 0, function* () {
                cli_ux_1.default.action.start('Logging time');
                const worklog = yield worklogs_1.default.addWorklog(input, attributes);
                cli_ux_1.default.action.stop('Done.');
                console.log(chalk_1.default.greenBright(`Successfully logged ${worklog.duration} to ${worklog.issueKey}, type ${chalk_1.default.bold(`tempo d ${worklog.id}`)} to undo.`));
            }));
        });
    },
    deleteWorklogs(worklogsIds) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const worklogId of worklogsIds) {
                yield execute(() => __awaiter(this, void 0, void 0, function* () {
                    yield deleteWorklog(worklogId);
                }));
            }
        });
    },
    listUserWorklogs(when, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            execute(() => __awaiter(this, void 0, void 0, function* () {
                cli_ux_1.default.action.start('Loading worklogs');
                const userWorklogs = yield worklogs_1.default.getUserWorklogs(when);
                cli_ux_1.default.action.stop('Done.');
                const table = yield worklogsTable.render(userWorklogs, verbose);
                console.log(table.toString());
            }));
        });
    },
    setAlias(aliasName, issueKey) {
        return __awaiter(this, void 0, void 0, function* () {
            execute(() => __awaiter(this, void 0, void 0, function* () {
                yield aliases_1.default.set(aliasName, issueKey);
            }));
        });
    },
    deleteAlias(aliasName) {
        return __awaiter(this, void 0, void 0, function* () {
            execute(() => __awaiter(this, void 0, void 0, function* () {
                yield aliases_1.default.delete(aliasName);
            }));
        });
    },
    listAliases() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const all = yield aliases_1.default.all();
            /* eslint-disable no-unused-expressions */
            (_a = all) === null || _a === void 0 ? void 0 : _a.forEach((value, key, _) => {
                console.log(`${key} => ${value}`);
            });
        });
    },
    startTracker(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield execute(() => __awaiter(this, void 0, void 0, function* () {
                let tracker = yield trackers_1.default.findTracker(input.issueKeyOrAlias);
                if (input.stopPreviousTracker && tracker) {
                    yield this.stopTracker({
                        issueKeyOrAlias: input.issueKeyOrAlias,
                        now: input.now
                    });
                }
                tracker = yield trackers_1.default.startTracker(input);
                if (!tracker) {
                    console.log(chalk_1.default.redBright(`Tracker for ${input.issueKeyOrAlias} already exists.`));
                    return;
                }
                console.log(`Started tracker for ${tracker.issueKey}.`);
            }));
        });
    },
    resumeTracker(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield execute(() => __awaiter(this, void 0, void 0, function* () {
                const tracker = yield trackers_1.default.resumeTracker(input);
                if (!tracker) {
                    console.log(chalk_1.default.redBright(`Tracker for ${input.issueKeyOrAlias} does not exists.`));
                    return;
                }
                console.log(`Resumed tracker for ${tracker.issueKey}.`);
            }));
        });
    },
    pauseTracker(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield execute(() => __awaiter(this, void 0, void 0, function* () {
                const tracker = yield trackers_1.default.pauseTracker(input);
                if (!tracker) {
                    console.log(chalk_1.default.redBright(`Tracker for ${input.issueKeyOrAlias} does not exists.`));
                    return;
                }
                console.log(`Paused tracker for ${tracker.issueKey}.`);
            }));
        });
    },
    stopTracker(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield execute(() => __awaiter(this, void 0, void 0, function* () {
                let tracker = yield trackers_1.default.stopTracker(input);
                if (!tracker) {
                    console.log(chalk_1.default.redBright(`Tracker for ${input.issueKeyOrAlias} does not exists.`));
                    return;
                }
                const intervalsWithInputs = createWorklogInputs(tracker, input.remainingEstimate);
                if (intervalsWithInputs.length === 0) {
                    console.log('There are no intervals with minimal length of 0 minutes.');
                    yield trackers_1.default.deleteTracker({ issueKeyOrAlias: tracker.issueKey });
                    return;
                }
                console.log('Logging tracker intervals');
                let allSucceeded = true;
                for (const intervalWithInput of intervalsWithInputs) {
                    const interval = intervalWithInput[0];
                    const input = intervalWithInput[1];
                    if (yield this.addWorklog(input)) {
                        tracker = yield trackers_1.default.removeInterval(tracker, interval);
                    }
                    else {
                        allSucceeded = false;
                    }
                }
                if (!allSucceeded) {
                    console.log(chalk_1.default.redBright('Failed to log some parts of worklog.'));
                    return;
                }
                yield trackers_1.default.deleteTracker({ issueKeyOrAlias: tracker.issueKey });
                console.log(chalk_1.default.greenBright('Logged all worklogs.'));
            }));
        });
    },
    deleteTracker(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield execute(() => __awaiter(this, void 0, void 0, function* () {
                const tracker = yield trackers_1.default.deleteTracker(input);
                if (!tracker) {
                    console.log(chalk_1.default.redBright(`Tracker for ${input.issueKeyOrAlias} does not exists.`));
                    return;
                }
                console.log(`Deleted tracker for ${tracker.issueKey}.`);
            }));
        });
    },
    listTrackers(now) {
        return __awaiter(this, void 0, void 0, function* () {
            execute(() => __awaiter(this, void 0, void 0, function* () {
                const userTrackers = yield trackers_1.default.getTrackers();
                for (const tracker of userTrackers) {
                    const table = yield trackersTable.render(tracker, now);
                    console.log(table.toString());
                }
            }));
        });
    }
};
function execute(action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield action();
            return true;
        }
        catch (e) {
            showError(e);
            return false;
        }
    });
}
function showError(e) {
    cli_ux_1.default.action.stop('Error.');
    console.log(chalk_1.default.redBright(e.message));
}
function deleteWorklog(worklogIdInput) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        cli_ux_1.default.action.start(`Deleting worklog ${worklogIdInput}`);
        const worklog = yield worklogs_1.default.deleteWorklog(worklogIdInput);
        cli_ux_1.default.action.stop('Done.');
        console.log(chalk_1.default.greenBright(`Successfully deleted worklog ${chalk_1.default.yellow(worklog.id)}.`), `Deleted worklog details: ${worklog.issueKey}, ${(_a = worklog.interval) === null || _a === void 0 ? void 0 : _a.startTime}-${(_b = worklog.interval) === null || _b === void 0 ? void 0 : _b.endTime} (${worklog.duration})`);
    });
}
function createWorklogInputs(tracker, remainingEstimate) {
    return tracker.intervals.map(interval => {
        return [
            interval,
            {
                issueKeyOrAlias: tracker.issueKey,
                description: tracker.description,
                when: date_fns_1.lightFormat(interval.start, 'yyyy-MM-dd'),
                startTime: date_fns_1.lightFormat(interval.start, 'HH:mm'),
                durationOrInterval: `${date_fns_1.differenceInMinutes(interval.end, interval.start)}m`,
                remainingEstimate: remainingEstimate
            }
        ];
    });
}
//# sourceMappingURL=tempo.js.map