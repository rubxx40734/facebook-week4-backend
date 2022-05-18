const mongoose = require('mongoose')
// 用new可以把schema加入預設值
const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Content 未填寫= =']
          },
          image: {
            type:String,
            default:""
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          user: {
              type: mongoose.Schema.ObjectId,
              ref: "User",
              // required: [true, '貼文姓名未填寫']
          },
          likes: {
              type:Number,
              default:0
            }
    },
    {
        versionKey : false
    }
)
const Post = mongoose.model('Post',postSchema)
module.exports = Post