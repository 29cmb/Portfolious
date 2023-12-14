const express = require('express');
const path = require('path')
const app = express();

app.use(express.static(path.join(__dirname, 'views')));
app.listen(3000, () => {
  console.log('server started');
});