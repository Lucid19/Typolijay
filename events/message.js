const mysql = require("mysql")
const config = require("../config.json")

module.exports = {
    name: "messageCreate",
    async execute(message){
        const user = message.author
        const memes = "898478900596862996"
        const debate = "907549432382386207"
        const motivational = "907551299577458688"
        const tables = ["debate", "motivational", "memes", "general"]
        const roles = [[],[],[],[]]

        const con = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        })

        function process(tableName) {
            con.query(`UPDATE ${tableName} SET messages = messages+1 WHERE user_id = ${user.id}`, (err) => {
                if(err) throw err
            })
        }
        
        function level(table){
            con.query(`UPDATE ${table} SET messages = 0 AND SET level = level+1 WHERE user_id = ${user.id}`, (err) => {
                if(err) throw err
            })
        }

        function rolesRemove(roleId){
            let role = message.guild.roles.cache.find(r => r.id === roleId)
            user.roles.remove(role)

            user.channel.send(`Well done ${user.mention} on acheiving ${role}`)
        }

        function rolesAdd(roleId){
            let role = message.guild.roles.cache.find(r => r.id === roleId)
            user.roles.add(role)
        }
        
        process("general")

        // memes
        if(message.channel.id === memes){
            process("meme")
        }
        // debate
        else if(message.channel.id === debate){
            process("debate")
        }
        // 
        else if(message.channel.id === motivational){
            process("motivational")
        }
        
        for(let i = 0; i < tables.length; i++){
            con.query(`SELECT * FROM ${table} WHERE user_id = ${user.id}`, (err, result) => {
                if(result.level === 0 && result.messages === 500){
                    level(tables[i])
                    rolesAdd(roles[i][0])
                }
                else if(result.level === 1 && result.messages === 1000){
                    level(tables[i])
                    
                    rolesAdd(roles[i][1])
                    rolesRemove(roles[i][0])
                }
                else if(result.level === 2 && result.messages === 1500){
                    level(tables[i])
                    
                    rolesAdd(roles[i][2])
                    rolesRemove(roles[i][1])
                }
                else if(result.level === 3 && result.messages === 2000){
                    level(tables[i])
                    
                    rolesAdd(roles[i][3])
                    rolesRemove(roles[i][2])
                }
                else if(result.level === 4 && result.messages === 2500){
                    level(tables[i])
                    
                    rolesAdd(roles[i][4])
                    rolesRemove(roles[i][3])
                }
            })
        }
        con.end()
    }
}
