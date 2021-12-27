const{SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get your Stats and Information"),
    async execute(interaction){
        const userEmbed = new MessageEmbed()
            .setTitle(`${interaction.user.username}'s profile`)
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .addField("Hi", "Hi")

        interaction.reply({embeds: [userEmbed]})
    }
}