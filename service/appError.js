//這邊是傳給 app.js 第 71 行去跑錯誤訊息
const appError = (httpStatus,errMessage,next)=>{
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
}

module.exports = appError