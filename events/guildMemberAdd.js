const mysql = require("mysql")
const config = require("../config.json")

tables = ["debate", "meme", "motivational", "general"]

module.exports = {
    name: "guildMemberAdd",
    async execute(member){
        // MYSQL connections
        const con = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        })

        // connecting to database
        con.connect(function(err) {
            if (err) throw err;
        });

        // setting up Users stats
        for(let i = 0; i < tables.length; i++){
            let sql = `INSERT INTO ${tables[i]} (user_id, level, messages) VALUE (${member.id}, 0, 0)`
            con.query(sql, (err) => {if(err) throw err})
        }
    }
}