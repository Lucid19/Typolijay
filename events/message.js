const mysql = require("mysql")
const config = require("../config.json")

module.exports = {
    name: "messageCreate",
    async execute(message){
        const user = message.author
        const memes = 898478900596862996
        const debate = 907549432382386207
        const motivational = 907551299577458688

        const con = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        })

        function process(tableName) {
            con.query(`UPDATE ${tableName} SET messages = messages+1 WHERE user_id = ${user.id}`, (err, results) => {
                if(err) throw err
            })
        }
        
        process("general")

        // memes
        if(message.channel.id === memes){
            process("memes")
        }
        // debate
        else if(message.channel.id === debate){
            process("debate")
        }
        // 
        else if(message.channel.id === motivational){
            process("motivational")
        }
    }
}