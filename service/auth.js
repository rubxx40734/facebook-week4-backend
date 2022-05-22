const express = require('express')
const jwt = require('jsonwebtoken')
const appError = require('./appError')
const handleErrorAsync = require('../server/handleErrorAsync')
const User = require('../models/userModel')

const generateSentJWT = async (user, statusCode, res) => {
    //產申JWT
    const token = jwt.sign({id:user._id,name:user.name},process.env.JWT_SECRET,{
     expiresIn:process.env.JWT_EXPIRES_DAY
 })
    user.password = undefined
    res.status(statusCode).json({
      "statue": "success",
      user : {
        token,
        name: user.name
      }
    })
 }

 const isAuth = handleErrorAsync(async (req,res,next) => {
    // 這邊確認token是否有帶入
     let token = ''
     if(req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
        console.log(token)
     }
     if(!token) {
       return next(appError(400,'您尚未登入',next))
     }
  
     //驗證token是否正確
     const decoded = await new Promise((resolve, reject) => {
       jwt.verify(token,process.env.JWT_SECRET,(err,payload) => {
          if(err) {
            reject(err)
            return next(appError(400,'您的token不正確或以過期',next))
          }else{
             resolve(payload)
          }
       })
     })
     console.log('decoded',decoded)
     const currentUser = await User.findById(decoded.id)
     req.user = currentUser
     next()
     console.log('currentUser',currentUser)
  })

  module.exports = {
      generateSentJWT,
      isAuth
  }