// discord.js
const{ SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Send your suggestions or topical questions for review!"),

    async execute(interaction){
        const user = interaction.user
        const client = interaction.client

        const suggestionEmbed = new MessageEmbed()
            .setTitle(`${user.username}'s suggestion`)
            .setColor("RANDOM")
            .addFields({name: "Instructions", value: "Hi! Please look at the selection menus below  the embed and specify your suggestion, once you have specified all the fields, you'll be able to submit it!"})

        const select = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("type")
                    .setPlaceholder("Type")
                    .addOptions([
                        {label: "Suggestion", description: "What can we improve?", value: "suggestion"},
                        {label: "Suggest topic", description: "would you like to suggest a topical question for future prompts?", value: "question"}]))
        
        const suggestion = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("category-suggestion")
                    .setPlaceholder("Category")
                    .addOptions([
                        {label: "Server", description: "What about the server?", value: "server-suggestion"},
                        {label: "Channels", description: "What about the channels?", value: "channels-suggestion"},
                        {label: "Events", description: "regarding certain events to be held or discussed", value: "events-suggestion"}]))

        const question = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("category-topic")
                    .setPlaceholder("Category")
                    .addOptions([
                        { label: "Debate", description: "Suggest a topic", value: "debate-topic"},
                        { label: "Server", description: "Any inquiries?", value: "server-inquiry"}]))
        
        const buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Send")
                    .setCustomId("sent")
                    .setStyle("SECONDARY")
                    .setDisabled(true),

                new MessageButton()
                    .setLabel("X")
                    .setCustomId("exit")
                    .setStyle("DANGER")
        )
        
        const message = await interaction.reply({embeds: [suggestionEmbed], components: [select, buttonRow], fetchReply: true})

        client.on("interactionCreate", async interaction => {
            if(!interaction.isSelectMenu()) return

            await interaction.deferUpdate()

            const id = interaction.customId
            const value = interaction.values

            if(id === "type" && value[0] === "suggestion"){
                await message.edit({components: [select, category, buttonRow]})
                console.log(value)
            }
            else if(id === "type" && value[0] === "question"){
                await message.edit({components: [select, question, buttonRow]})
                console.log(value)
            }
        })
    }
}