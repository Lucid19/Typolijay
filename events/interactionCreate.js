module.exports = {
    name: "interactionCreate",
    async execute(interaction){
        client = interaction.client
        // Checking message component
        if(!interaction.isCommand()) return

        const command = client.commands.get(interaction.commandName)

        if(!command) return

        try{
            await command.execute(interaction)
        } catch(err){
            if(err) console.error(err)

            await interaction.reply({
                content: "An error occured",
                ephemeral: true
        })
    }
}}