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
   photo : {
        type: String,
        default: 'https://images.unsplash.com/photo-1620428268482-cf1851a36764?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8Y2FydG9vbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
   },
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