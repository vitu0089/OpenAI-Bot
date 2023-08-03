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

async function MakeRequest(Text:string):Promise<string> {
    return new Promise((res) => {
        const HasSlot = RateLimit.HasOpenSlot()
        
        if (!HasSlot) {
            res(`Rate Limit ${Settings.RateLimit}/${Settings.RateLimit}@60s`)
        }

        AI.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: Text
            }]
        })
        .then((Res) => {
            res(Res.data.choices[0].message?.content || "No content found")
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
    var FilteredText = RawText.replace(`<@${Client.user.id}>`,"")

    var Response = await message.reply("Thinking...") 
    MakeRequest(FilteredText).then((Text:string) => {
        Response.edit(Text)
    }).catch((err) => {
        console.log(err)
        Response.edit("Failed...")
    })
})

Client.login(Settings.DiscordKey)