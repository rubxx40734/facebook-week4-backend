const Post = require('../models/postModel')
const User = require('../models/userModel')
const handleErrorAsync = require('../server/handleErrorAsync')
const express = require('express');
const router = express.Router();
const appError = require('../service/appError')
const {  isAuth, generateSentJWT } = require('../service/auth')

/* GET users listing. */
// 取得所有資料
router.get('/', isAuth, async (req, res, next)=> {
    // 這邊作時間排序的篩選 (三元判斷式)
    const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
    // 這邊做關鍵字的搜尋 (三元判斷式&正規表達式)
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const allPost = await Post.find(q).populate({
        path: 'user',
        select: 'name photo'
    }).sort(timeSort);
        res.status(200).json({
            "status" : "success !",
            allPost
        })
});
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
module.exports = router;