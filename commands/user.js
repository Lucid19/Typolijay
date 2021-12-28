const{SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get your Stats and Information"),
    async execute(interaction){
        const userEmbed = new MessageEmbed()
            .setTitle(`${interaction.user.username}'s profile`)
            .setColor("RANDOM")
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .addFields({name: "Joined", value: interaction.guild.member.joinedAt},
                       {name: "Created", value: interaction.user.createdAt, inline: true},
                       {name: "ID", value: interaction.user.id})

        interaction.reply({embeds: [userEmbed]})
    }
}