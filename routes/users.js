const express = require('express');
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const appError = require('../service/appError')
const handleErrorAsync = require('../server/handleErrorAsync')
const User = require('../models/userModel')
const { isAuth, generateSentJWT } = require('../service/auth')
const router = express.Router();

router.post('/sign_up',handleErrorAsync(async function(req, res, next){
    let {email, password, confirmpassword, name, photo, sex} = req.body
    // console.log(email,password,confirmpassword,name)
    //內容不可為空
    if(!email|| !password || !confirmpassword || !name){
     return next(appError(400,'欄位未確實填寫',next))
    }
    //確認密碼是否一致
    if( password !== confirmpassword) {
      return next(appError(400,'確認密碼不一致!',next))
    }
    if(!validator.isLength(password,{min:8}) || !validator.matches(password, /[a-z]/,/[A-Z]/)){
       return next(appError(400,'密碼需大於8碼且包含英文!',next))
    }
    if(!validator.isEmail(email)){
      return next(appError(400,'信箱格式錯誤',next))
    }
    //密碼加密
    password = await bcrypt.hash(password,12)
    const newUser = await User.create({
      email,
      password,
      name,
      photo,
      sex
    })
    console.log(newUser)
    generateSentJWT(newUser,200,res)
}))

router.post('/sign_in', handleErrorAsync(async function(req, res, next){
    const { email, password } = req.body
    if(!email || !password){
      return next(appError(400,'密碼或帳號未填寫!',next))
    }
    const user = await User.findOne({email: email}).select('+password')
    const auth = await bcrypt.compare(password, user.password)
    console.log(user, auth)
    if(!auth) {
      return next(appError(400,'您的密碼錯誤',next))
    }
    generateSentJWT(user,200,res)
}))


router.get('/profile',isAuth, handleErrorAsync(async function(req, res, next){
   res.status(200).json({
     "status" : "success",
     "user" : req.user
   })
}))

router.patch('/profile',isAuth, handleErrorAsync(async function(req, res, next){
  const {name, sex, photo} = req.body
  if(name == '' || name == undefined){
    return next(appError(400,'暱稱位填寫',next))
  }
  const user = await User.findByIdAndUpdate({_id:req.user._id},{
    name,sex,photo
  },{ runValidators: true } )
  console.log('看這裡',user)
  generateSentJWT(user,200,res)
}))

router.post('/updatePassword',isAuth, handleErrorAsync(async function(req,res,next){
   const { password, confirmpassword} = req.body
   if(!validator.isLength(password,{min:8})||!validator.isLength(confirmpassword,{min:8})) {
      return next(appError(400,'您的密碼小於8碼',next))
   }
   if(password !== confirmpassword) {
     return next(appError(400,'您的密碼不一致',next))
   }
   newPassword = await bcrypt.hash(password,12)
   console.log(password)
   console.log(req.user)
   const user = await User.findByIdAndUpdate({_id:req.user._id},{
     password: newPassword
   })
   console.log(user)
   generateSentJWT(user,200,res)
}))


module.exports = router;
