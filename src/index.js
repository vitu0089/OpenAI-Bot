"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const openai_1 = require("openai");
const discord_js_1 = __importStar(require("discord.js"));
const Settings_1 = __importDefault(require("./Settings"));
const RateLimit_1 = __importDefault(require("./RateLimit"));
const AIConfig = new openai_1.Configuration({
    organization: Settings_1.default.OrganizationID,
    apiKey: Settings_1.default.APIKey
});
const Client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.Guilds
    ],
    partials: [
        discord_js_1.Partials.Channel
    ]
});
const AI = new openai_1.OpenAIApi(AIConfig);
const RateLimit = new RateLimit_1.default(Settings_1.default.RateLimit, Settings_1.default.RateLimitPeriod);
function MakeRequest(Text) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res) => {
            const ID = RateLimit.HasOpenSlot();
            if (!ID) {
                return;
            }
            AI.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{
                        role: "user",
                        content: Text
                    }]
            })
                .then((Res) => {
                var _a;
                console.log("Request made with stats -", Res.status);
                res((_a = Res.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content);
            })
                .catch((err) => {
                console.log(err);
                res(false);
            });
        });
    });
}
Client.on("ready", () => {
    var StartTime = new Date().getTime();
    console.log(`Done - ${new Date().getTime() - StartTime}ms`);
});
Client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot || !Client.user || !message.mentions.has(Client.user.id))
        return;
    // Remove tag
    var RawText = message.content;
    var FilteredText = RawText.replace(`<@${Client.user.id}>`, "");
    var Response = yield MakeRequest(FilteredText);
    message.reply(Response || "Failed to make request");
}));
Client.login(Settings_1.default.DiscordKey);
