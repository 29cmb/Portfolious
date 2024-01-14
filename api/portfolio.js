module.exports = function(app){
    app.get("/portfolio/:id", function(req, res){
        console.log("📫 [API] | /portfolio/:id requested")
        const id = req.params.id;
        const db = require("../db.js");

        db.getConnection(function(err, connection){
            if(err){
                console.log(`💣 [API] | Error connecting to the database. ${err}`)
            }

            db.query("SELECT * FROM portfolios WHERE PID = ?", [id], function(error, results){
                if(error){
                    console.log(`💣 [API] | A database error has occurred and error 500 has been sent. ${error}`)
                    return res.status(500).json({ success: false, message: 'Database error' });
                }

                if(results[0]){
                    connection.release();
                    // TODO: Send a file with that portfolio
                } else {
                    connection.release();
                    return res.sendFile(path.join(__dirname, process.env.DIR, '/error/404/index.html'));
                }
            })
        })
    })
    console.log(`✅ [API] | /portfolio/:id is set up`)
}