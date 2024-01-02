module.exports = function(app){
    app.post('/api/v1/universal/getUserFromCookie', function(req, res){
        var { cookie } = req.body
        const db = require("../../db.js")

        cookie = cookie.substring(0, cookie.indexOf('_.') !== -1 ? cookie.indexOf('_.') : cookie.length)

        db.getConnection(function(err,connection){
            if (err) {
                console.log(`💣 [API] | Error connecting to the database. ${err}`)
            }
            db.query(`SELECT * FROM UserDatabase WHERE session = ?`, [cookie], function(error, results){
                if (error) {
                    console.log(`💣 [API] | A database error has occurred and checking has failed. ${error}`)
                    connection.release();
                    return res.status(500).json({ success: false, message: 'Database error' });
                }

                if(results[0]){
                    connection.release();
                    return res.status(201).json({ success: true, message: "Valid cookie", user: results[0] })
                } else {
                    connection.release();
                    return res.status(401).json({ success: false, message: "Invalid cookie" })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                }
            })
        })
    })
    console.log(`✅ [API] | /universal/check is set up`)
}