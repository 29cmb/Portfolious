const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config()

const { rateLimit } = require('express-rate-limit')

const selectiveLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 15, 
	standardHeaders: true, 
	legacyHeaders: false,
  message: function(req, res, next) {
    console.log(`✉️ [API] | User is being rate limited by selectiveLimiter`)
    return res.json({ success: false, message: "You are sending too many requests. Please try again later." });
  }
})

const universalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 35,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/universal/v1', universalLimiter, function(req, res, next) {
  if (req.rateLimit.remaining === 0) {
      console.log(`✉️ [API] | User is being rate limited by universalLimiter`)
      return res.sendFile(path.join(__dirname, process.env.DIR, "/error/429/index.html"))
  }
  next();
});
app.use('/api/v1', selectiveLimiter)

app.use(express.static(path.join(__dirname, process.env.DIR)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.method === 'GET') {
    if (res.statusCode === 404) {
      res.sendFile(path.join(__dirname, process.env.DIR, '/error/404/index.html'));
    } else if (res.statusCode === 500) {
      res.sendFile(path.join(__dirname, process.env.DIR, '/error/500/index.html'));
    } else if (res.statusCode === 403) {
      res.sendFile(path.join(__dirname, process.env.DIR, '/error/403/index.html'));
    }
  }
  next();
});


app.listen(process.env.PORT, () => {
  console.log(`Running on localhost:${process.env.PORT}
  \n   _____           _    __      _ _                 
  |  __ \\         | |  / _|    | (_)                
  | |__) |__  _ __| |_| |_ ___ | |_  ___  _   _ ___ 
  |  ___/ _ \\| '__| __|  _/ _ \\| | |/ _ \\| | | / __|
  | |  | (_) | |  | |_| || (_) | | | (_) | |_| \\__ \\
  |_|   \\___/|_|   \\__|_| \\___/|_|_|\\___/ \\__,_|___/
                                                    
  Created by DevCmb
  Views Directory: ${process.env.DIR}
  Database Setup: ${(process.env.dbName && process.env.dbUsername && process.env.dbHost && process.env.dbPassword) ? "Yes" : "No"}`);
});

require("./api/signup.js")(app);
require("./api/login.js")(app);
require("./api/universal/getUserFromCookie.js")(app);
require("./api/portfolio.js")(app);
require("./api/getPortfolio.js")(app);