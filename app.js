var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process 這是express內建
	console.error('Uncaughted Exception！')
	console.error(err);
	process.exit(1);
});

dotenv.config({path:'./config.env'})
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)
mongoose.connect(DB)
 .then(() => {console.log('資料庫連線成功')})
 .catch((error) => {
   console.log(error)
 })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require('./routes/post');
const { default: axios } = require('axios');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter)
// // catch 404 and forward to error handler (框架內建的)
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// 404錯誤(自訂義)
app.use(function(req,res,next){
   res.status(400).json({
     "status": "error",
     "message" : "找無此路由資訊"
   })
})
//自行定義Production的錯誤模式
const resErrorPro = function(err,res) {
  //出現預期內的錯誤
  if(err.isOperational) {
    res.status(err.statusCode).json({
      "message" : err.message
    })
  }else if(err.messageFormat == undefined) {
    res.status(500).json({
      "status" : "error 罐頭訊息",
      "message" : "您的ID不存在><"
    })
  }
  else{
    //發生不可預期的錯誤
    console.error('不可預期錯誤', err)
    console.log(err.messageFormat)
    res.status(500).json({
      "status" : "error 罐頭訊息",
      "message" : "出現重大錯誤 請聯絡系統管理員"
    })
  }
}
//自行定義dev模式的錯誤模式
const resErrorDev = function(err,res) {
  res.status(err.statusCode).json({
    "message": err.message,
    "error" : err,
    "stack" : err.stack
  })
}

// express處理錯誤  這邊的err是固定的參數 不能改
app.use(function(err,req,res,next){
  //dev
   err.statusCode = err.statusCode || 500
   if(process.env.NODE_ENV === "dev"){
     return resErrorDev(err,res)
   }
   if(err.name === 'ValidationError'){
     err.message = "資料欄位未填寫 請重新輸入",
     err.isOperational = true
     return resErrorPro(err,res)
   }
    resErrorPro(err,res)
})

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
  // 記錄於 log 上
});

module.exports = app;
