// discord.js
const{SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed, MessageButton, MessageActionRow, edit} = require("discord.js")

// packages
const mysql = require("mysql")
const config = require("../config.json")

const con = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get your Stats and Information"),
    async execute(interaction){
        user = interaction.user
        member = interaction.guild.members.cache.get(user.id)
        auth = user.id

        // initial interface
        const userEmbed = new MessageEmbed()
            .setTitle(`${user.username}'s profile`)
            .setColor("RANDOM")
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .addFields({name: "Joined", value: new Date(member.joinedTimestamp).toLocaleDateString(), inline: true},
                       {name: "Created", value: new Date(user.createdTimestamp).toLocaleDateString(), inline: true},
                       {name: "ID", value: String(user.id)})
        
        // displays users stats within the server
        const statEmbed = new MessageEmbed()
            .setTitle(`${user.username}'s stats`)
            .setColor("RANDOM")
            .addFields({name: "Roles", value: "...", inline: true},
                       {name: "Rank", value: "20", inline: true})

        // buttons displayed
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("back")
                    .setLabel("<")
                    .setStyle("PRIMARY")
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId("stats")
                    .setLabel("stats")
                    .setStyle("SECONDARY")
            )

        // message itself as a variable
        const message = await interaction.reply({embeds: [userEmbed], components: [row], fetchReply: true})

        // used to check whether the interaction is by author
        const filter = (interaction) => {
            if(interaction.user.id === auth) return true
            return interaction.reply({content: "you are not the author", ephemeral: true})
        }

        // collects all interactions
        const collector = interaction.channel.createMessageComponentCollector({ filter })

        // processes interactions
        collector.on('collect', (ButtonInteraction) => {
            ButtonInteraction.deferUpdate()
            const id = ButtonInteraction.customId
            if(id === "stats"){
                row.components[0].setDisabled(false)
                row.components[1].setDisabled(true)
                message.edit({embeds: [statEmbed], components: [row]})
            }
            else if(id === "back"){
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(false)
                message.edit({embeds: [userEmbed], components: [row]})
            }
        })
    }
}