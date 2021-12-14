// Package
const Discord = require("discord.js")
const config = require("./config.json")
const fs = require("fs")

// Client
const intents = new Discord.Intents(32767)
const client = new Discord.Client({intents})

client.commands = new Discord.Collection()

// handlers
const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"))
const commandsFolder = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const eventsFolder = fs.readdirSync("./events").filter(file => file.endsWith(".js"))

for(file of functions){
    require(`./functions/${file}`)(client)
}
client.handleEvents(eventsFolder, "./events")
client.handleCommands(commandsFolder, "./commands")
// Client login (Keep at bottom)
client.login(config.token)