const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://ratneshnath:RATNESh99@cluster0.x9keh.mongodb.net/myFirstes?retryWrites=true&w=majority", 
//{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })

{
    useNewUrlParser: true
 })


    .then(() => console.log('mongodb running on 27017'))
    
    .catch(err => console.log(err))

app.use('/', route);



app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});