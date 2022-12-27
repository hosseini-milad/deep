const express = require("express");
const apiRoutes = require('./router/mainRouter');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));
app.get('/admin',(req,res)=>{
    res.send('Dashboard Connect');
})

app.use('/api', apiRoutes)

app.use(express.json());

// Logic goes here

module.exports = app;