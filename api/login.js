const crypto = require("node:crypto")
module.exports = function(app){
    require('dotenv').config();
    app.post('/api/v1/login', function(req, res){
        console.log(`📫 [API] | /login posted`)
        const db = require("../db.js")
        const { username, password } = req.body

        db.getConnection(function(err, connection){
            if (err) {
                console.log(`💣 [API] | Error connecting to the database. ${err}`)
            }
            db.query('SELECT * FROM UserDatabase WHERE Username = ? OR Email = ?', [username, username], function(error, results, fields){
                if (error) {
                    console.log(`💣 [API] | A database error has occurred and login has failed. ${error}`)
                    connection.release();
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                if(results[0]){
                    const encrypted = crypto.createHmac("sha256", process.env.secret).update(password).digest('hex')
                    if(results[0].EncryptedPassword == encrypted){
                        connection.release()
                        console.log(`✅ [API] | Login successful`)

                        var workingCookie = results[0].session + `_.${crypto.createHmac("sha256", process.env.cookieSecret).update(password).digest('hex')}`

                        return res.status(201).json({ success: true, message: 'Signed in successfully', user: results[0], cookie: workingCookie});
                    } else {
                        console.log("❌ [API] | Incorrect password")
                        connection.release()
                        return res.status(401).json({ success: false, message: 'Incorrect password' })
                    }
                } else {
                    console.log("❌ [API] | User is not registered")
                    connection.release()
                    return res.status(401).json({ success: false, message: 'User not found' })
                }
            })
        })
    })
    console.log(`✅ [API] | /login is set up`);
}
