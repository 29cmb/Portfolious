const path = require('path')
module.exports = function(app, debug){
    require('dotenv').config();
    app.get("/portfolio/:id/view", function(req, res){
        if(debug.sendStatus) console.log(`📫 [API] | /portfolio/:id/view requested`)
        
        const id = req.params.id;
        const db = require("../db.js");

        db.getConnection(function(err, connection){
            if(err){
                if(debug.sendErrors) console.log(`💣 [API] | Error connecting to the database. ${err}`)
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            db.query("SELECT * FROM portfolios WHERE PID = ?", [id], function(error, results){
                if(error){
                    if(debug.sendErrors) console.log(`💣 [API] | A database error has occurred and error 500 has been sent. ${error}`)
                    return res.status(500).json({ success: false, message: 'Database error' });
                }

                if(results[0]){
                    connection.release();
                    return res.sendFile(path.join(__dirname, `/../${process.env.DIR}/error/404/index.html`));
                } else {
                    connection.release();
                    return res.sendFile(path.join(__dirname, `/../${process.env.DIR}/error/404/index.html`));
                }
            })
        })
    })
    console.log(`✅ [API] | /portfolio/:id is set up`)
}