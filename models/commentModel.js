const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment : {
        type : String,
        required : [true, 'can not null message!']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : [true, 'user must belong to post']
    },
    post : {
        type : mongoose.Schema.ObjectId,
        ref : 'Post',
        required : [true , 'comment must belong to post']
    }
})
commentSchema.pre( /^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name id createdAt photo'
    })
    next()
})
const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment