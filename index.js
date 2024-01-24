// Packages
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const app = express();
const { rateLimit } = require('express-rate-limit')
require("dotenv").config()
const fs = require('fs');

// JSON Configurations

const configDir = path.join(__dirname, '/config');
const configFiles = fs.readdirSync(configDir);
const config = {};

configFiles.forEach(file => {
    if (path.extname(file) === '.json') {
        const filePath = path.join(configDir, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        const fileNameWithoutExt = path.basename(file, '.json');
        config[fileNameWithoutExt] = JSON.parse(fileData);
    }
});

// Rate limiting

const selectiveLimiter = rateLimit({
	windowMs: config.rateLimits.selective.windowMs,
	max: config.rateLimits.selective.max, 
	standardHeaders: config.rateLimits.selective.standardHeaders, 
	legacyHeaders: config.rateLimits.selective.legacyHeaders,
  message: function(req, res, next) {
    console.log(config.rateLimits.selective.consoleMessage)
    return res.json({ success: false, message: config.rateLimits.selective.jsonError });
  }
})

const universalLimiter = rateLimit({
  windowMs: config.rateLimits.universal.windowMs,
  max: config.rateLimits.universal.max,
  standardHeaders: config.rateLimits.universal.standardHeaders,
  legacyHeaders: config.rateLimits.universal.legacyHeaders,
})

if(config.rateLimits.rateLimitBypass == false){
  console.log("✉️ [API] | Rate limiting enabled")
  app.use('/api/universal/v1', universalLimiter, function(req, res, next) {
    if (req.rateLimit.remaining === 0) {
      console.log(config.rateLimits.universal.consoleMessage)
    }
    next();
  });
  app.use('/api/v1', selectiveLimiter)
} else {
  console.log("✉️ [API] | Rate limiting disabled")
}

// Express App Configurations
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

// API Routes
fs.readdirSync(path.join(__dirname, 'api')).forEach(file => {
  if (path.extname(file) === '.js') {
      require(`./api/${file}`)(app, config.development.debugSelective);
  }
});
fs.readdirSync(path.join(__dirname, 'api/universal')).forEach(file => {
  if (path.extname(file) === '.js') {
      require(`./api/universal/${file}`)(app, config.development.debugUniversal);
  }
});

// Handle errors
app.use('*', (req, res, next) => {
  if (req.method === 'GET') {
    res.status(404).sendFile(path.join(__dirname, process.env.DIR, '/error/404/index.html'));
  } else {
    next();
  }
});