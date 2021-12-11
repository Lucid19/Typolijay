// Package
const Discord = require("discord.js")
const config = require("./config.json")

// Client
const intents = new Discord.Intents(32767)
const client = new Discord.Client({intents})

client.on("ready", () => console.log("Typolijay is online!"))

client.login(config.token)