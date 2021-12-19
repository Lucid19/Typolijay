const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const config = require("../config.json")
const fs = require('fs')

const clientId = config.Guild
const guildId = config.Client

module.exports = (client) => {
    client.handleCommands = async (commandFolder) => {
        client.commandArray = []
        for (const file of commandFolder) {
            const command = require(`../commands/${file}`)

            client.commands.set(command.data.name, command)
            client.commandArray.push(command.data.toJSON())
        }
    }
    const rest = new REST({ version: '9' }).setToken(config.token)

        async () => {
            try {
                console.log('Started refreshing application (/) commands.')

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId), {
                        body: client.commandArray
                    }
                )

                console.log('Succesfully reloaded application (/) commands.')
            } catch(error){
                console.error(error)
            }
    }
}