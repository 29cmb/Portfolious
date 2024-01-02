const crypto = require("node:crypto")
module.exports = function(app){
    require('dotenv').config()
    app.post('/api/v1/signup', function(req, res){
        console.log(`📫 [API] | /signup posted`)
        const db = require("../db.js")
        const { email, username, password } = req.body
        db.getConnection(function(err, connection){
            if (err) {
                console.log(`💣 [API] | Error connecting to the datbase. ${err}`)
            }
            db.query('SELECT * FROM UserDatabase WHERE Email = ? OR Username = ?', [email, username], function(error, results, fields) {
                if (error) {
                    console.log(`💣 [API] | A database error has occured and signup has failed. ${error}`)
                    connection.release();
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
    
                if(results.length != 0){
                    console.log("❌ [API] | Credentials are already registered")
                    if (results.some(result => result.Email === email)) {
                        connection.release();
                        return res.status(409).json({ success: false, message: 'Email is already in use' });
                    } else if (results.some(result => result.Username === username)) {
                        connection.release();
                        return res.status(409).json({ success: false, message: 'Username is already in use' });
                    }
                }

                
                const pw = crypto.createHmac("sha256", process.env.secret).update(password).digest('hex')
                db.query('SELECT UserId FROM UserDatabase ORDER BY UserId DESC LIMIT 1', function(f_error, f_results, f_fields){
                    if(f_error){
                        console.log(`💣 [API] | A database error has occured and signup has failed. ${f_error}`)
                        connection.release();
                        return res.status(500).json({ success: false, message: 'Database error' });
                    }
                    var cookie = "!do_not_share!portfolious_login:"
                    cookie += generateCookie(64);
                    db.query('INSERT INTO UserDatabase (UserId, Email, Username, EncryptedPassword, session, Admin) VALUES (?, ?, ?, ?, ?, 0)', [(f_results[0].UserId + 1), email, username, pw, cookie])
                    connection.release()
                    console.log(`✅ [API] | Signup successful`)
                    
                    return res.status(201).json({ success: true, message: 'User registered successfully', user: [(f_results[0].UserId + 1), email, username, pw, 0] });
                })
            })
        })
    })
    console.log(`✅ [API] | /signup is set up`)
}

function generateCookie(length){
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}