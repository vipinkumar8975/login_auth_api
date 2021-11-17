const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const user = require('../model/user'); 
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');  
const checkAuth = require('../middleware/check-auth').checkAuth;







router.get('/get',checkAuth,(req,res,next)=>{
    
    user.find()
    .then(result=>{
        res.status(200).json({
            user : result    
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
})

router.post('/signup',(req,res,next)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        // Store hash in your password DB.
        if(err){
            return res.status(500).json({
               error: err,
            })
        }else{
            const user1 = new user({
                _id:new mongoose.Types.ObjectId,
                username:req.body.username,
                password:hash,
                phone:req.body.phone,
                email:req.body.email,
                userType:req.body.userType
            })
            user1.save()
            .then(result=>{
                res.status(200).json({
                    new_user : result
                })
            })
            .catch(err=>{
                res.status(500).json({
                    error : err
                })
            })
        }
    });
})


router.post('/login',(req,res,next)=>{
    user.find({username:req.body.username})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                msg: 'user not exist'
            })
        }
        bcrypt.compare(req.body.password, user[0].password,(err,result)=>{
            if(!result){
                return res.status(401).json({
                    msg: 'password not matching'
                })
            }
            if(result){
               const token = jwt.sign({
                   username: user[0].username,
                   userType: user[0].userType,
                   email: user[0].email,
                   phone: user[0].phone
               }, 'this is dummy text',
               {
                   expiresIn:"24hr"
               });
               res.status(200).json({
                   username: user[0].username,
                   password:user[0].password,
                   phone: user[0].phone,
                   email: user[0].email,
                   userType: user[0].userType,
                   token: token
               })       
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
})

module.exports =  router;