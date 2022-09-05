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
const axios_1 = __importDefault(require("axios"));
const authenticator_1 = __importDefault(require("../config/authenticator"));
const tempoAxios = axios_1.default.create({
    baseURL: 'https://api.tempo.io/core/3'
});
tempoAxios.interceptors.request.use(function (axiosConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield authenticator_1.default.hasTempoToken()) {
            const credentials = yield authenticator_1.default.getCredentials();
            axiosConfig.headers.Authorization = `Bearer ${credentials.tempoToken}`;
        }
        return axiosConfig;
    });
});
exports.default = tempoAxios;
//# sourceMappingURL=tempoAxios.js.map