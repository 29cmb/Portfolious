const express = require('express');
const path = require('path')
const app = express();

require("dotenv").config()

app.use(express.static(path.join(__dirname, process.env.DIR)));
app.listen(process.env.PORT, () => {
  console.log(`\n   _____           _    __      _ _                 
  |  __ \\         | |  / _|    | (_)                
  | |__) |__  _ __| |_| |_ ___ | |_  ___  _   _ ___ 
  |  ___/ _ \\| '__| __|  _/ _ \\| | |/ _ \\| | | / __|
  | |  | (_) | |  | |_| || (_) | | | (_) | |_| \\__ \\
  |_|   \\___/|_|   \\__|_| \\___/|_|_|\\___/ \\__,_|___/
                                                    
  Created by DevCmb
  Views Directory: ${process.env.DIR}                                                  
  \nLaunched on localhost:${process.env.PORT}`);
});