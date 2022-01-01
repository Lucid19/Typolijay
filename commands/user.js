const{SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed, MessageButton, MessageActionRow, edit} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get your Stats and Information"),
    async execute(interaction){
        user = interaction.user
        member = interaction.guild.members.cache.get(user.id)
        auth = user.id

        const userEmbed = new MessageEmbed()
            .setTitle(`${user.username}'s profile`)
            .setColor("RANDOM")
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .addFields({name: "Joined", value: new Date(member.joinedTimestamp).toLocaleDateString(), inline: true},
                       {name: "Created", value: new Date(user.createdTimestamp).toLocaleDateString(), inline: true},
                       {name: "ID", value: String(user.id)})
        
        const statEmbed = new MessageEmbed()
            .setTitle(`${user.username}'s stats`)
            .setColor("RANDOM")
            .addFields({name: "Acheivements", value: "Acheivement"},
                       {name: "Points", value: "0"},
                       {name: "rank", value: "20"})

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

        const message = await interaction.reply({embeds: [userEmbed], components: [row], fetchReply: true})

        const filter = (interaction) => {
            if(interaction.user.id === auth) return true
            return interaction.reply({content: "you are not the author", ephemeral: true})
        }

        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1})

        collector.on('end', (ButtonInteraction) => {
            ButtonInteraction.first().deferUpdate()
            const id = ButtonInteraction.first().customId
            if(id === "status") message[0].edit({embeds: [statEmbed], components: [row]})
            else if(id === "back")return
        })
    }
}