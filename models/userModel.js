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
   photo : String
})

const User = mongoose.model('User',userSchema)
module.exports = User