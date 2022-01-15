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

        con.connect((err) => {if(err)throw err;})

        // getting user's stats from sql database: debate table
        let sql = "SELECT * FROM debate"
        result_debate = con.query(sql, (err, result) => {
            if(err) throw err
            for(let i=0; i < result.length; i++){
                if(result[i][0] === member.id) return result[i]
            }
        })

        // getting user's stats from sql database: general table
        sql = "SELECT * FROM general"
        result_general = con.query(sql, (err, result) => {
            if(err) throw err
            for(let i=0; i < result.length; i++){
                if(result[i][0] === member.id) return result[i]
            }
        })

        // getting user's stats from sql database: meme table
        sql = "SELECT * FROM meme"
        result_meme = con.query(sql, (err, result) => {
            if(err) throw err
            for(let i=0; i < result.length; i++){
                if(result[i][0] === member.id) return result[i]
            }
        })

        // getting user's stats from sql database: motivational table
        sql = "SELECT * FROM motivational"
        result_motivational = con.query(sql, (err, result) => {
            if(err) throw err
            for(let i=0; i < result.length; i++){
                if(result[i][0] === member.id) return result[i]
            }
        })

        function bar(level, messages){
            function prog(messages, max){
                let bar = ""
                for(let i = 0; i < 10; i++){
                    if(messages > max/10){
                        bar.concat(":blue_square:")
                        messages -= max/10
                    }
                    else{
                        bar.concat("black_large_square")
                    }
                }
                return bar
            }

            if(level === 0) prog(messages, 500)
            else if(level === 1) prog(messages, 1000)
            else if(level === 2) prog(messages, 1500)
            else if(level === 3) prog(messages, 2000)
            else if(level === 4) prog(messages, 2500)
            else if(level === 5) return "MAX"
        }

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
            .addFields({name: "general", value: `lvl: ${result_general[1]} ${bar(result_general[1], result_general[2])} \n`},
                       {name: "debate", value: `lvl: ${result_debate[1]} ${bar(result_general[1], result_general[2])} \n`},
                       {name: "motivational", value: `lvl: ${result_motivational[1]} ${bar(result_motivational[1], result_motivational[2])} \n`},
                       {name: "meme", value: `lvl: ${result_meme[1]} ${bar(result_meme[1], result_meme[2])} \n`})

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
        })
    }
}