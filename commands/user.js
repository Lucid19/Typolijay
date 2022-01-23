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
        const auth = user.id
        const tables = ["general", "debate", "motivational", "meme"]

        const con = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        })

        const results = []

        function setResult(level, messages){
            results.push([level, messages])
        }

        function getResult(tableName) {
            return new Promise((resolve, reject) => {
                con.query(`SELECT * FROM ${tableName}`, (err, results) => {
                    if(err) return reject(err)
                    for(let i = 0; i < results.length; i++){
                        if(results[i].user_id === member.id) return resolve(results[i])
                    }
                    return resolve(`User not found in ${tableName}`)
                })
            })
        }

        for(const table of tables){
            try {
                const result = await getResult(table)
                if(result === "User not found"){
                    console.log(`${result} in ${table}`)
                }
                else{
                    setResult(result.level, result.messages)
                }
            } catch(err){
                console.log(`Couldnt retreive data from ${table}: ${err}`)
            }
        }

        function bar(level, messages){
            function prog(max){
                let bar = ":"
                for(let i = 0; i < 10; i++){
                    if(messages > max/10){
                        bar = bar.concat(":blue_square:")
                        messages -= max/10
                    }
                    else{
                        bar = bar.concat(":black_large_square:")
                    }
                    
                }
                return bar
            }

            if(level === 0) return prog(500)
            else if(level === 1) return prog(1000)
            else if(level === 2) return prog(1500)
            else if(level === 3) return prog(2000)
            else if(level === 4) return prog(2500)
            else if(level === 5) return "MAX"
        }

        console.log(results)
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
            .addFields({name: "general", value: `lvl: ${results[0][0]} ${bar(results[0][0], results[0][1])} ${results[3][1]}`},
                       {name: "debate", value: `lvl: ${results[1][0]} ${bar(results[1][0], results[1][1])} ${results[3][1]}`},
                       {name: "motivational", value: `lvl: ${results[2][0]} ${bar(results[2][0], results[2][1])} ${results[3][1]}`},
                       {name: "meme", value: `lvl: ${results[3][0]} ${bar(results[3][0], results[3][1])} ${results[3][1]}`})

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
            if(interaction.user.id === auth) return true
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
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(true)
                row.components[2].setDisabled(true)
                row.components[3].setDisabled(true)
                message.edit({components: [row]})
                return
            }

        collector.on('end', () => {
            return
        })
        })
    }
}