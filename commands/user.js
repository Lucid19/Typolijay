// discord.js
const{ SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")

// packages
const mysql = require("mysql")
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get your Stats and Information"),
    async execute(interaction){
        const user = interaction.user
        const member = interaction.guild.members.cache.get(user.id)
        const tables = ["general", "debate", "motivational", "meme"]

        
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
        
        const levelEmbed = new MessageEmbed()
            .setTitle(`${user.username}'s progress`)
            .setColor("RANDOM")
            .addFields({name: "general", value: "lvl: 3 :blue_square: :blue_square: :blue_square: :black_large_square: :black_large_square: 4"},
                       {name: "debate", value: "lvl: 2 :blue_square: :blue_square: :blue_square: :black_large_square: :black_large_square: 3"},
                       {name: "motivational", value : "lvl: 0 :blue_square: :black_large_square: :black_large_square: :black_large_square: :black_large_square: 1"},
                       {name: "meme", value: "lvl: 1 :blue_square: :blue_square: :black_large_square: :black_large_square: :black_large_square: 2"})

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
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId("progress")
                    .setLabel("progress")
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId("exit")
                    .setLabel("X")
                    .setStyle("DANGER")
            )

        // message itself as a variable
        const message = await interaction.reply({embeds: [userEmbed], components: [row], fetchReply: true})

        // used to check whether the interaction is by author
        const filter = (interaction) => {
            if(interaction.user.id === user.id) return true
            return interaction.reply({content: "you are not the author", ephemeral: true})
        }

        // collects all interactions
        const collector = message.createMessageComponentCollector({ filter, time: 30000 })

        // processes interactions
        collector.on('collect', (ButtonInteraction) => {
            ButtonInteraction.deferUpdate()
            const id = ButtonInteraction.customId
            if(id === "stats"){
                row.components[0].setDisabled(false)
                row.components[1].setDisabled(true)
                row.components[2].setDisabled(false)
                message.edit({embeds: [statEmbed], components: [row]})
            }
            else if(id === "back"){
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(false)
                row.components[2].setDisabled(false)
                message.edit({embeds: [userEmbed], components: [row]})
            }
            else if(id === "progress"){
                row.components[0].setDisabled(false)
                row.components[1].setDisabled(false)
                row.components[2].setDisabled(true)
                message.edit({embeds: [levelEmbed], components: [row]})
            }
            else if(id === "exit"){
                disable()
                return
            }

        collector.on('end', () => {
            disable()
            return
        })
        })
    }
}
