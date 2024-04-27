const crypto = require("node:crypto")
module.exports = async function (app, debug) {
    require('dotenv').config()
    app.post('/api/v1/signup', async function (req, res) {
        if (debug.sendStatus) console.log(`📫 [API] | /signup posted`)
        const db = require("../db.js")
        const { email, username, password } = req.body

        if (checkValidation(email, username, password, res) == true) {
            if (username.length > 25) {
                if(debug.sendStatus) console.log("❌ [API] | Username must be less than 25 characters")
                return res.status(400).json({ success: false, message: 'Username must be less than 25 characters long' });
            }
    
            if (username.length < 3) {
                if(debug.sendStatus) console.log("❌ [API] | Username must be more than 3 characters")
                return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long' });
            }
    
            if(await profanityCheck(username)){
                if(debug.sendStatus) console.log("❌ [API] | Username contains profanity")
                return res.status(400).json({ success: false, message: "Username contains profanity"})
            }
            db.getConnection(function (err, connection) {
                if(err){
                    if(debug.sendErrors) console.log(`💣 [API] | Error connecting to the database. ${err}`)
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                db.query('SELECT * FROM userdatabase WHERE Email = ? OR Username = ?', [email, username], function (error, results, fields) {
                    if (error) {
                        if(debug.sendErrors) console.log(`💣 [API] | A database error has occurred and signup has failed. ${error}`)
                        connection.release();
                        return res.status(500).json({ success: false, message: 'Database error' });
                    }

                    if (results.length != 0) {
                        if(debug.sendStatus) console.log("❌ [API] | Credentials are already registered")
                        if (results.some(result => result.Email === email)) {
                            connection.release();
                            return res.status(409).json({ success: false, message: 'Email is already in use' });
                        } else if (results.some(result => result.Username === username)) {
                            connection.release();
                            return res.status(409).json({ success: false, message: 'Username is already in use' });
                        }
                    }


                    const pw = crypto.createHmac("sha256", process.env.secret).update(password).digest('hex')
                    db.query('SELECT UserId FROM userdatabase ORDER BY UserId DESC LIMIT 1', function (f_error, f_results, f_fields) {
                        if (f_error) {
                            if(debug.sendErrors) console.log(`💣 [API] | A database error has occurred and signup has failed. ${f_error}`)
                            connection.release();
                            return res.status(500).json({ success: false, message: 'Database error' });
                        }
                        var cookie = "!do_not_share!portfolious_login:"
                        cookie += generateCookie(64);
                        db.query('INSERT INTO UserDatabase (UserId, Email, Username, EncryptedPassword, session, Admin) VALUES (?, ?, ?, ?, ?, 0)', [((f_results[0].UserId + 1) || 1), email, username, pw, cookie])
                        connection.release()
                        if(debug.sendStatus) console.log(`✅ [API] | Signup successful`)

                        return res.status(201).json({ success: true, message: 'User registered successfully', user: [((f_results[0].UserId + 1) || 1), email, username, pw, 0] });
                    })
                })
            })
        } else {
            if(debug.sendErrors) console.log("❌ [API] Validation failed")
        }
    })

    console.log(`✅ [API] | /signup is set up`)
}

function generateCookie(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function isValidEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}

function profanityCheck(username) {
    const request = require('request');
    return new Promise((resolve, reject) => {
        request.get({
            url: `https://api.api-ninjas.com/v1/profanityfilter?text=${username}`,
            headers: {
                'X-Api-Key': process.env.apininjas
            },
        }, function (error, response, body) {
            if (error || response.statusCode != 200) {
                if(debug.sendErrors) console.error('💣 [API] | Profanity request failed');
                reject(false);
            } else {
                console.log(body);
                const bodyJson = JSON.parse(body);
                resolve(bodyJson.has_profanity);
            }
        });
    });
}

function checkValidation(email, username, password, res) {
    if (!email || !username || !password) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return false
    }

    if (!isValidEmail(email)) {
        res.status(400).json({ success: false, message: 'Invalid email format' });
        return false
    }

    if (username.length < 3) {
        res.status(400).json({ success: false, message: 'Username must be at least 3 characters long' });
        return false
    }

    if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        return false
    }

    if (require("../config/domainSignupBlocklist.json").includes(email.split("@")[1])){
        res.status(400).json({ success: false, message: "Temporary email detected, please use a personal email."})
        return false
    }

    return true
}