const express = require('express');

const app = express();

app.use(require('./administrators'));
app.use(require('./login'));

module.exports = app;