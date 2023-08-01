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

Client.on("messageCreate",(message) => {
    if (message.author.bot || !Client.user || !message.mentions.has(Client.user.id)) return;

    // Remove tag
    var RawText = message.content
    var FilteredText = RawText.replace(`<@${Client.user.id}>`,"")

    console.log("Filtered",FilteredText)
})

Client.login(Settings.DiscordKey)