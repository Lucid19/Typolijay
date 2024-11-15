// discord.js
const{ SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js")
const { google } = require("googleapis")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Send your suggestions or topical questions for review!")
        .addStringOption(option => option.setName("suggestion").setDescription("What do you suggest?").setRequired(true)),

    async execute(interaction){
        const user = interaction.user
        const moderator = interaction.guild.channels.cache.get("939990739939639338")

        const suggest = interaction.options.getString("suggestion")

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
                        {label: "Suggest topic", description: "would you like to suggest a topical question for future prompts?", value: "suggest-topic"}]))
        
        const suggestion = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("category-suggestion")
                    .setPlaceholder("Category")
                    .addOptions([
                        {label: "Server", description: "What about the server?", value: "server"},
                        {label: "Bot", description: "What about the bot?", value: "bot"},
                        {label: "Events", description: "regarding certain events to be held or discussed", value: "events"}]))

        const question = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("category-topic")
                    .setPlaceholder("Category")
                    .addOptions([
                        { label: "Debate", description: "Suggest a topic", value: "debate"},
                        { label: "Server", description: "Any inquiries?", value: "server"}]))
        
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

        function disable() {
            buttonRow.components[0].setDisabled(true)
            buttonRow.components[1].setDisabled(true)
            message.edit({components : [buttonRow]})
        }
        
        const message = await interaction.reply({embeds: [suggestionEmbed], components: [select, buttonRow], fetchReply: true})
        const filter = (interaction) => {
            if(interaction.user.id === user.id) return true
            return interaction.reply({content: "you are not the author", ephemeral: true})
        }

        const collector = message.createMessageComponentCollector({ filter, time: 30000 })

        // Values for Embed
        var typeValue
        var categoryValue

        // Temp placeholder
        var set

        collector.on('collect', interaction => {
            interaction.deferUpdate()

            const id = interaction.customId

            if(interaction.isSelectMenu()){
                const value = interaction.values[0]

                if(id === "type" && value === "suggestion"){
                    buttonRow.components[0].setDisabled(true)
                    select.components[0].setPlaceholder(value)
                    typeValue = value
                    set = suggestion
                }
                else if(id === "type" && value === "suggest-topic"){
                    buttonRow.components[0].setDisabled(true)
                    select.components[0].setPlaceholder(value)
                    typeValue = value
                    set = question
                }
                else{
                    buttonRow.components[0].setDisabled(false)
                    question.components[0].setPlaceholder(value)
                    suggestion.components[0].setPlaceholder(value)
                    categoryValue = value
                }
            }
            else{
                if(id === "exit"){
                    disable()
                    return
                }
                else if(id === "sent"){
                    disable()

                    const moderatorEmbed = new MessageEmbed()
                        .setTitle(`${user.username}'s suggestion`)
                        .setTimestamp()
                        .setColor("RANDOM")
                        .setThumbnail(user.displayAvatarURL())
                        .addFields({name: "Details", value: `Type: ${typeValue}\nCategory: ${categoryValue}`, inline: true},
                                   {name: "User", value: user.tag, inline: true},
                                   {name: "Suggestion", value: suggest})
                                   
                    moderator.send({embeds: [moderatorEmbed]})
                    return
                }
            }
            message.edit({components: [select, set, buttonRow]})
        })

        collector.on("end", ()=> {
            disable()
            return
        })
        
    }
}
