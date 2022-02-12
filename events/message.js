const mysql = require("mysql")
const config = require("../config.json")

module.exports = {
    name: "messageCreate",
    async execute(message){
        const user = message.author

        // data
        // MYSQL
        const tables = ["debate", "motivational", "meme", "general"]

        // roles data
        // general
        const roles = [[[config.newcomer],[config.novice],[config.regular],[config.pro],[config.veteran]], 
        // debate
                       [[config.debater],[config.debaterGreenhorn],[config.solidDebater],[config.proDebater],[config.masterDebater]], 
        // motivational
                       [[config.positive],[config.motivator],[config.serverMotivator],[config.superMotivator],[config.topMotivator]], 
        // memes
                       [[config.memerInTraining],[config.memerStudent],[config.memerPHD],[config.masterMemer],[config.dankMemer]]]

        // Connecting to the database
        const con = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        })

        // processes the request
        function process(tableName) {
            con.query(`UPDATE ${tableName} SET messages = messages+1 WHERE user_id = ${user.id}`, (err) => {
                if(err) throw err
            })
        }
        
        // levels up the user
        function level(tableName){
            con.query(`UPDATE ${tableName} SET messages = 0 AND SET level = level+1 WHERE user_id = ${user.id}`, (err) => {
                if(err) throw err
            })
        }

        // adding and removing the roles
        function rolesRemove(roleId){
            let role = message.guild.roles.cache.find(r => r.id === roleId)
            user.roles.remove(role)

            user.channel.send(`Well done ${user.mention} on acheiving ${role}`)
        }

        function rolesAdd(roleId){
            let role = message.guild.roles.cache.find(r => r.id === roleId)
            user.roles.add(role)
        }

        // processing requests
        process("general")
        if(message.channel.id === config.memeChannel){
            process("meme")
        }
        else if(message.channel.id === config.debateChannel){
            process("debate")
        }
        else if(message.channel.id === config.motivationalChannel){
            process("motivational")
        }
        
        // levelling
        for(let i = 0; i < tables.length; i++){
            con.query(`SELECT * FROM ${tables[i]} WHERE user_id = ${user.id}`, (err, result) => {
                if(err) throw err
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
