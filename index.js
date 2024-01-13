const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config()

const { rateLimit } = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 25, 
	standardHeaders: true, 
	legacyHeaders: false,
  message: "You are sending too many requests. Please try again later." 
})

app.use('/api', limiter)
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
  Database Setup: ${(process.env.dbName && process.env.dbUsername && process.env.dbHost && process.env.dbPassword && process.env.dbUserDatabase) ? "Yes" : "No"}`);
});

require("./api/signup.js")(app);
require("./api/login.js")(app);
require("./api/universal/getUserFromCookie.js")(app);
require("./api/portfolio.js")(app);
require("./api/getPortfolio.js")(app);