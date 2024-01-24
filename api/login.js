const crypto = require("node:crypto")
module.exports = function(app, debug){
    require('dotenv').config();
    app.post('/api/v1/login', function(req, res){
        if(debug.sendStatus){
            console.log(`📫 [API] | /login posted`)
        }
        const db = require("../db.js")
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        db.getConnection(function(err, connection){
            if(err){
                if(debug.sendErrors) console.log(`💣 [API] | Error connecting to the database. ${err}`)
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            db.query('SELECT * FROM userdatabase WHERE Username = ? OR Email = ?', [username, username], function(error, results, fields){
                if (error) {
                    if(debug.sendErrors) console.log(`💣 [API] | A database error has occurred and login has failed. ${error}`)
                    connection.release();
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                if(results[0]){
                    const encrypted = crypto.createHmac("sha256", process.env.secret).update(password).digest('hex')
                    if(results[0].EncryptedPassword == encrypted){
                        connection.release()
                        if(debug.sendStatus) console.log(`✅ [API] | Login successful`)

                        var workingCookie = results[0].session + `_.${crypto.createHmac("sha256", process.env.cookieSecret).update(password).digest('hex')}`

                        return res.status(201).json({ success: true, message: 'Signed in successfully', user: results[0], cookie: workingCookie});
                    } else {
                        if(debug.sendStatus) console.log("❌ [API] | Incorrect password")
                        
                        connection.release()
                        return res.status(401).json({ success: false, message: 'Incorrect password' })
                    }
                } else {
                    if(debug.sendStatus) console.log("❌ [API] | User is not registered")
                    
                    connection.release()
                    return res.status(401).json({ success: false, message: 'User not found' })
                }
            })
        })
    })
    console.log(`✅ [API] | /login is set up`);
}
