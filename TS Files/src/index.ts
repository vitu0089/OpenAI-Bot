import { Configuration, OpenAIApi } from "openai"
import Discord, { GatewayIntentBits as Intents, Partials } from "discord.js"
import Settings from "./Settings"
import RLModule from "./RateLimit"

const AIConfig = new Configuration({
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
const AI = new OpenAIApi(AIConfig)
const RateLimit = new RLModule(Settings.RateLimit,Settings.RateLimitPeriod)

async function MakeRequest(Text:string) {
    return new Promise((res) => {
        const ID = RateLimit.HasOpenSlot()
        if (!ID) {
            return
        }

        AI.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: Text
            }]
        })
        .then((Res) => {
            console.log("Request made with stats -",Res.status)
            res(Res.data.choices[0].message?.content)
        })
        .catch((err) => {
            console.log(err)
            res(false)
        })
    })
}

Client.on("ready",() => {
    var StartTime = new Date().getTime()

    console.log(`Done - ${new Date().getTime() - StartTime}ms`)
})

Client.on("messageCreate",async (message) => {
    if (message.author.bot || !Client.user) return;

    // Remove tag
    var RawText = message.content
    var FilteredText = RawText.replace(`<@${Client.user.id}>`,"")

    var Response = await MakeRequest(FilteredText)
    message.reply((Response as string) || "Failed to make request")
})

Client.login(Settings.DiscordKey)