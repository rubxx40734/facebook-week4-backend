const express = require('express')
const multer = require('multer')
const path = require('path')
const appError = require('./appError')
const handleErrorAsync = require('../server/handleErrorAsync')

const upload = multer({
    limits : {
        fileSize : 2*1024*1024
    },
    fileFilter(req, file, cb){
       const ext = path.extname(file.originalname).toLowerCase()
       if( ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg'){
          cb(new Error("檔案格式上傳錯誤，僅限 jpg, png或 jpeg 檔案"))
       }
       cb(null,true)
    }
}).any()

module.exports = upload