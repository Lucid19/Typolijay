// discord.js
const{ SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setname("suggest")
        .setDescription("Send your suggestions or topical questions for review!"),

    async execute(interaction){
        const user = interaction.user

        const suggestionEmbed = new MessageEmbed()
            .setTitle(`${user.username}'s suggestion`)
            .setColor("RANDOM")
            .addField({name: "Instructions", value: "Hi! Please look at the selection menus below  the embed and specify your suggestion, once you have specified all the fields, just click on the blue arrow to submit it to us!"})

        const selectRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("type")
                    .setPlaceholder("Type")
                    .addOptions([
                        {label: "Suggestion", description: "What can we improve?", value: "suggestion"},
                        {label: "Suggest topic", description: "would you like to suggest a topical question for future prompts?", value: "question"}]),

                new MessageSelectMenu()
                    .setCustomId("category-topic")
                    .setPlaceholder("Category")
                    .addOptions([
                        { label: "Debate", description: "Suggest a topic", value: "debate-topic"},
                        { label: "Server", description: "Any inquiries?", value: "server-inquiry"}]),
                
                new MessageSelectMenu()
                    .setCustomId("category-suggestion")
                    .setPlaceholder("Category")
                    .addOptions([
                        {label: "Server", description: "What about the server?", value: "server-suggestion"},
                        {label: "Channels", description: "What about the channels?", value: "channels-suggestion"},
                        {label: "Events", description: "regarding certain events to be held or discussed", value: "events-suggestion"}])
        )
        
            const buttonRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setTitle("Send")
                        .setCustomId("sent")
                        .setStyle("SECONDARY")
                        .setDisabled(true),

                    new MessageButton()
                        .setTitle("X")
                        .setCustomId("exit")
                        .setStyle("DANGER")
        )
        
        const message = interaction.reply({embeds: [suggestionEmbed], components: [selectRow[0]], fetchReply: true})
    }
}