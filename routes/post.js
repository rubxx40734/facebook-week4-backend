const Post = require('../models/postModel')
const User = require('../models/userModel')
var express = require('express');
var router = express.Router();

/* GET users listing. */
// 取得所有資料
router.get('/', async (req, res, next)=> {
    // 這邊作時間排序的篩選 (三元判斷式)
    const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
    // 這邊做關鍵字的搜尋 (三元判斷式&正規表達式)
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const allPost = await Post.find(q).populate({
        path: 'user',
        select: 'name photo'
    }).sort(timeSort);
        res.status(200).json({
            allPost
        })
});
// 刪除所有資料
router.delete('/', async (req, res, next) => {
    const post = await Post.deleteMany({})
    res.status(200).json({
        "status" : "success",
        "post" : post
    })
  });
// 刪除單筆資料
router.delete('/:id', async (req, res, next) => {
const id = req.params.id
try {
    const post = await Post.findByIdAndDelete(id)
    res.status(200).json({
        "status" : "success",
        post
    })
}
catch(error){
    res.status(400).json({
        "status" : "找無此路由 或 ID有誤",
        "error" : error
    })
}
});

// 新增單筆資料
router.post('/', async (req, res, next) => {
    try{
        const data = {
            content: req.body.content,
            image: req.body.image,
            createdAt: req.body.createdAt,
            user: req.body.user,
            likes: req.body.likes
        }
        const newPost = await Post.create(data)
        res.status(200).json({
            "status" : "success",
            newPost
        })
    }
    catch(error){
        res.status(400).json({
            "status" : "找無此路由 或 ID有誤",
            "error" : error
        })
    }
});
// 修改單筆資料
router.patch('/:id', async (req,res,next) => {
    const id = req.params.id
    const data = req.body
    console.log(id,data)
    try{
        const newPost = await Post.findByIdAndUpdate(id,data)
        res.status(200).json({
            "status" : "success",
            newPost
        })
    }
    catch(error){
        res.status(400).json({
            "status" : "找無此路由 或 ID有誤",
            "error" : error
        }) 
    }
})
module.exports = router;