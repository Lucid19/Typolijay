// filesystem
const fs = require("fs")
const config = require("./config.json")

// Initialise client
const { Client, Intents, Collection} = require("discord.js")
const client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]})

// commands
const commandFiles = fs.readdirSync("./commands").filter( file => file.endsWith(".js"))
const commands = []
client.commands = new Collection()

// Events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"))

// loading command files 
for(const file of commandFiles){
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
}

// loading event files
for(const file of eventFiles){
    const event = require(`./events/${file}`)

    if(event.once){
        client.once(event.name, (...args) => event.execute(...args, commands))
    }
    else(
        client.on(event.name, (...args) => event.execute(...args, commands))
    )
}

client.login(config.token)