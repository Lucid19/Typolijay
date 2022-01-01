const{SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed, MessageButton, MessageActionRow, Message, ButtonInteraction } = require("discord.js")

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

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("back")
                    .setLabel("<")
                    .setStyle("PRIMARY")
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId("status")
                    .setLabel("status")
                    .setStyle("SECONDARY")
            )

        interaction.reply({embeds: [userEmbed], components: [row]})

        const filter = (interaction) => {
            if(interaction.user.id === interaction.author.id) return true
            return interaction.reply({content: "you are not the author", ephemeral: true})
        }

        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1})

        collector.on('end', (ButtonInteraction) => {
            console.log(ButtonInteraction.first().customId)
        })
    }
}