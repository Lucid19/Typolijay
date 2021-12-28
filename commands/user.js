const{SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { MessageButton } = require("discord-buttons")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get your Stats and Information"),
    async execute(interaction){
        user = interaction.user
        member = interaction.guild.members.cache.get(user.id)

        const userEmbed = new MessageEmbed()
            .setTitle(`${user.username}'s profile`)
            .setColor("RANDOM")
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .addFields({name: "Joined", value: new Date(member.joinedTimestamp).toLocaleDateString(), inline: true},
                       {name: "Created", value: new Date(user.createdTimestamp).toLocaleDateString(), inline: true},
                       {name: "ID", value: String(user.id)})

        const back = new MessageButton()
            .setStyle("gray")
            .setLabel("<")
            .setID("back")

        const notes = new MessageButton()
            .setStyle("blurple")
            .setLabel("note")
            .setID("notes")

        interaction.reply({embeds: [userEmbed], buttons: [back, notes]})
    }
}