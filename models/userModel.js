const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   name : {
       type: String,
       required : [true, '請輸入您的姓名']
   },
   email : {
       type : String,
       required : [true, '請輸入您的信箱'],
       unique: true,
       lowercase: true,
        select: false
   },
   photo : String,
   sex : {
       type : String,
       enum: ['male','female']
   },
   password : {
       type : String,
       required : [true,'請輸入密碼'],
       minlength : 8,
       select : false
   },
   createAt : {
       type : Date,
       default : Date.now
   },
   followers: [
      {
          user: {
              type: mongoose.Schema.ObjectId,
              ref: 'User',
          },
          createAt: {
              type: Date,
              default: Date.now
          }
      }
   ],
   following: [
       {
           user: {
               type: mongoose.Schema.ObjectId,
               ref: 'User'
           },
           createAt: {
               type: Date,
               default: Date.now
           }
       }
   ]

})

const User = mongoose.model('User',userSchema)
module.exports = User