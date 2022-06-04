const Post = require('../models/postModel')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')
const handleErrorAsync = require('../server/handleErrorAsync')
const express = require('express');
const router = express.Router();
const appError = require('../service/appError')
const {  isAuth } = require('../service/auth');
// const Post = require('../models/postModel');

/* GET users listing. */
// 取得所有貼文資料
router.get('/', isAuth, async (req, res, next)=> {
    // 這邊作時間排序的篩選 (三元判斷式)
    const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
    // 這邊做關鍵字的搜尋 (三元判斷式&正規表達式)
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const allPost = await Post.find(q).populate({
        path: 'user',
        select: 'name photo'
    }).populate({
        path : 'comments',
        select : 'comment user createdAt'
    }).sort(timeSort);
        res.status(200).json({
            "status" : "success !",
            allPost
        })
});

//取的個人貼文
router.get('/user/:id', handleErrorAsync(async (req,res,next) => {
    const userId = req.params.id
    const personPost = await Post.find({user:userId}).populate({
        path: 'user',
        select: 'name photo'
    }).populate({
        path : 'comments',
        select : 'comment user createdAt'
    })

    res.status(200).json({
        "status" : "success",
        "post" : personPost
    })

}))

//取得單一貼文
router.get('/:id', handleErrorAsync(async (req,res,next) => {
    const postId = req.params.id
    const onePost = await Post.find({_id : postId}).populate('user').populate('comments')
    res.status(200).json({
        "status" : "success",
        post : onePost
    })
}))
// 刪除所有資料
router.delete('/',isAuth, async (req, res, next) => {
    const post = await Post.deleteMany({})
    res.status(200).json({
        "status" : "success",
        "post" : post
    })
  });
// 刪除單筆資料
router.delete('/post/:id',isAuth, handleErrorAsync(async (req, res, next) => {
    const id = req.params.id
    const post = await Post.findByIdAndDelete(id)
    res.status(200).json({
        "status" : "success",
        post
    })
}));

// 新增單筆資料
router.post('/', isAuth, handleErrorAsync(async function (req, res, next)  {
        const {content, image} = req.body
        if(content == undefined){
            return appError(400,'內容未填寫',next)
        }
        const newPost = await Post.create({
            user: req.user.id,
            content,
            image
        })
        console.log('新貼文', newPost)
        res.status(200).json({
            "status" : "success",
             newPost
        })
}));
// 修改單筆資料
router.patch('/:id', isAuth, handleErrorAsync(async (req,res,next) => {
    const id = req.params.id
    const data = {
        content: req.body.content,
        image: req.body.image,
        createdAt: req.body.createdAt,
        user: req.body.user,
        likes: req.body.likes
    }
    if(data.content == undefined){
        return appError(400,'內容未填寫',next)
    }
    console.log(id,data)
        const newPost = await Post.findByIdAndUpdate(id,data)
        res.status(200).json({
            "status" : "success",
            newPost
        })
    
}))

//新增讚數
router.post('/:id/likes',isAuth, handleErrorAsync(async (req,res,next) => {
    const _id = req.params.id
    const greatPost = await Post.findOneAndUpdate(
        {_id},
        { $addToSet : { likes: req.user.id} }
    )
    // const greatPostNum =  greatPost.likes.length
    console.log('loooook',  greatPost )
    res.status(200).json({
       "status":"success",
       "userId": req.user.id,
       "postId" : _id
    })
}))
//刪除讚數
router.delete('/:id/likes',isAuth, handleErrorAsync(async (req,res,next) => {
    const _id = req.params.id
    const greatPost = await Post.findOneAndUpdate(
        {_id},
        { $pull : { likes: req.user.id} }
    )
    const greatPostNum = greatPost.likes.length
    console.log('look1541653',greatPostNum)
    res.status(200).json({
       "status":"success",
       "userId": req.user.id,
       "postId" : _id,
       "greateNum": greatPostNum
    })
}))
//取的誰按讚資訊
router.get('/:id/greateNum',isAuth, handleErrorAsync(async (req,res,next) => {
    const Id = req.params.id
    console.log('loooookthis',Id)
    const Detail = await Post.find({_id:Id}).populate({
        path: 'likes',
        select : 'name photo'
    })
    console.log(Detail)
    res.status(200).json({
        "status" : "success",
        "greateNum" : Detail
    })
}))
//新增留言
router.post('/:id/comment',isAuth, handleErrorAsync(async (req,res,next) => {
    const post = req.params.id
    const user = req.user.id
    const comment = req.body.comment
    console.log(post,user,comment)
    const newComment = await Comment.create({
        post,
        user,
        comment
    })
    res.status(200).json({
        "status" : "success",
        newComment
    })
}))
module.exports = router;