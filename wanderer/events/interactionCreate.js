module.exports = {
    name: "interactionCreate",
    async execute(interaction){
        client = interaction.client
        const command = client.commands.get(interaction.commandName)

        if(!command)return

        try{
            await command.execute(interaction)
        } catch(err){
            if(err)console.error(err)

            await interaction.reply({
                content: "an error occured",
                ephemeral: true
            })
        }
    }
}