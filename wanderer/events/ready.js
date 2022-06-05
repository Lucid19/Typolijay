// API
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9");
const { Guild } = require("discord.js");

const config = require("../config.json")

module.exports = {
    name : "ready",
    once : true,
    execute(client, commands){
        console.log("bot is ready!");

        // user
        const CLIENT_ID = client.user.id

        // REST API
        const rest = new REST({
            version : "9"
        }).setToken(config.token)

        // registering commands
        async() => {
            try{
                // for guild
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, config.GuildID), {
                    body: commands
                })
                console.log("Commands ready")
            }
            catch(err){
                if(err)console.error(err)
            }
        }

    }
}