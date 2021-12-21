module.exports = {
    name: "interactionCreate",
    once: true,
    async execute(interaction){
        // Checking message component
        if(!interaction.isCommand()) return

        const command = interaction.client.commands.get(interaction.commandName)

        if(!command) return

        try{
            await command.execute(interaction)
        } catch(err){
            if(err) console.error(err)

            await interaction,reply({
                content: "An error occured",
                ephemeral: true
        })
    }
}}