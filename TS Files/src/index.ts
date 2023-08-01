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

async function MakeRequest(Text:string):Promise<any> {
    return new Promise((res) => {
        const ID = RateLimit.HasOpenSlot()
        if (!ID) {
            res(false)
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
            res("Failed to make request")
        })
    })
}

Client.on("ready",() => {
    var StartTime = new Date().getTime()

    console.log(`Done - ${new Date().getTime() - StartTime}ms`)
})

Client.on("messageCreate",async (message) => {
    if (message.author.bot || !Client.user || !message.mentions.has(Client.user.id)) return;

    // Remove tag
    var RawText = message.content
    var FilteredText = RawText.replace(`<@${Client.user.id}>`,"") + " in english"

    var Response = await message.reply("Thinking...") 
    MakeRequest(FilteredText).then((Text:string | false) => {
        Response.edit((Text as string) || "Rate Limit 3/3@60s")
    })
})

Client.login(Settings.DiscordKey)