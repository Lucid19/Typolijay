const{SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get your Stats and Information"),
    async execute(interaction){
        user = interaction.user
        member = interaction.guild.members.cache.get(user.id)

        const userEmbed = new MessageEmbed()
            .setTitle(`${interaction.user.username}'s profile`)
            .setColor("RANDOM")
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .addFields({name: "Joined", value: member.joinedAt},
                       {name: "Created", value: user.createdAt, inline: true},
                       {name: "ID", value: user.id})

        interaction.reply({embeds: [userEmbed]})
    }
}