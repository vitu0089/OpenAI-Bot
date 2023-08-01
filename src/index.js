"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const Settings_1 = __importDefault(require("./Settings"));
const Config = new openai_1.Configuration({
    organization: Settings_1.default.OrganizationID,
});
