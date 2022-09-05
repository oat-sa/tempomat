"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("@oclif/command");
exports.run = command_1.run;
process.on('SIGINT', function () {
    process.exit(1);
});
//# sourceMappingURL=index.js.map