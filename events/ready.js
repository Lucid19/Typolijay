// API
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9")

const config = require("../config.json")

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {
        console.log("ready")

        const CLIENT_ID = client.user.id

        // setup REST API
        const rest = new REST({
            version: "9"
        }).setToken(config.token)

        // Registering commands
        var commandRegister = async() => {
            try{
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                })
                console.log("global commands set")
            }catch(err){
                if(err)console.error(err)}
    }
    commandRegister()
    }
}