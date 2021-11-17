const express = require('express');
const app = express();
const userRoute = require('./api/routes/user');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

mongoose.connect('mongodb+srv://vipinkumar8975:abcd1234@cluster0.tfgar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

mongoose.connection.on('error',err=>{
         console.log('connection failed');
});

mongoose.connection.on('connected',connected=>{
         console.log('connected with database...');
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use('/user',userRoute)

app.use(fileUpload({
    useTempFiles:true
}))

app.use((req,res,next)=>{
    res.status(200).json({
        message: ' app is running on port 8000'
    })
})

// for error handeling 

app.use((req,res,next)=>{
    res.status(404).json({
        error: ' bad request'
    })
})

module.exports = app;