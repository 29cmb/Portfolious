const path = require('path')
module.exports = function(app, debug){
    app.post('/api/v1/getUserFromId', function(req,res){
        if(debug.sendStatus) console.log("📫 [API] | /getUserFromId posted")

        var { id } = req.body
        if(!id) return res.status(400).json({ success: false, message: "Missing required fields."})

        const db = require("../db.js")

        db.getConnection(function(err, connection){
            if(err){
                if(debug.sendErrors) console.log(`💣 [API] | Error connecting to the database. ${err}`)
                return res.status(500).json({   success: false, message: "Database error"   })
            }
            db.query("SELECT * FROM UserDatabase WHERE UserId = ?", [id], function(error, results){
                if (error) {
                    if(debug.sendErrors) console.log(`💣 [API] | A database error has occurred and searching has failed. ${error}`)
                    return res.status(500).json({ success: false, message: 'Database error' });
                }

                if(results[0]){
                    connection.release()
                    return res.status(201).json({ success: true, message: "User found!", user: results[0]})
                } else {
                    connection.release()
                    return res.status(404).json({ success: false, message: "User not found" })
                }
            })
        })
        
    })
    app.get("/users/:id", function(req,res){
        if(debug.sendStatus) console.log("📫 [API] | /users/:id requested")

        res.sendFile(path.join(__dirname, `/../${process.env.DIR}/user/index.html`))
    })
    console.log(`✅ [API] | /getUserFromId is set up`)
    console.log(`✅ [API] | /users/:id is set up`)
}