import { Configuration, OpenAIApi } from "openai"
import Discord, { GatewayIntentBits as Intents, Partials } from "discord.js"
import Settings from "./Settings"

const Config = new Configuration({
    organization: Settings.OrganizationID,
    apiKey: Settings.APIKey
})

const Client = new Discord.Client({
    intents: [
        Intents.GuildMembers,
        Intents.GuildMessages,
        Intents.MessageContent,
        Intents.GuildPresences,
        Intents.Guilds
    ],
    partials: [
        Partials.Channel
    ]
})

Client.on("ready",() => {
    var StartTime = new Date().getTime()

    console.log(`Done - ${new Date().getTime() - StartTime}ms`)
})

Client.login(Settings.DiscordKey)