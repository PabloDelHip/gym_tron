const express = require('express');

const app = express();

app.use(require('./administrators'));
app.use(require('./login'));
app.use(require('./producto'));
app.use(require('./categoria'));
app.use(require('./upload'));
app.use(require('./imagenes'));


// app.use(require('./products')); 

module.exports = app;