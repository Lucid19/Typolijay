const{SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get your Stats and Information"),
    async execute(interaction, memberMen=""){
        user = interaction.user

        if(memberMen == "") memberMen = user

        member = interaction.guild.members.cache.get(memberMen.id)

        const userEmbed = new MessageEmbed()
            .setTitle(`${memberMen.username}'s profile`)
            .setColor("RANDOM")
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .addFields({name: "Joined", value: new Date(memberMen.joinedTimestamp).toLocaleDateString(), inline: true},
                       {name: "Created", value: new Date(member.createdTimestamp).toLocaleDateString(), inline: true},
                       {name: "ID", value: String(memberMen.id)})

        interaction.reply({embeds: [userEmbed]})
    }
}