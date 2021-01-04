var http = require("http");//获取http对象
var url = require("url");//获取url对象
var path = require("path");

var imgExt = new Array(".png",".jpg",".jpeg",".bmp",".gif");
var cssExt = new Array(".css");
var jsExt = new Array(".js");

Array.prototype.contain = function(obj){
    for(var i=0; i<this.length; i++){
        if(this[i] === obj)
            return true;
    }
    return false;
};

//http、url都是系统自带的模块，而下面的requestHandlers是我们手动编写的模块，对应当前目录下的requestHandlers.js文件
var requestHandlers = require("./requestHandlers");

//onRequest函数，用于处理http请求，不同的url请求交由不同的函数进行处理
function onRequest(request, response){
    var pathname = url.parse(request.url).pathname;//获取请求的URL

    //requestHandlers的handle属性又是一个对象，该对象包含多组属性：属性值，属性名对应uri，属性值对应处理函数，详见requestHandlers.js
    if(typeof requestHandlers.handle[pathname] === "function"){
        requestHandlers.handle[pathname](request, response);
    }
    //处理图片链接
    else if(typeConfirm(imgExt,request.url)){
        var ext = path.extname(path.basename(request.url)) ;
        console.log("ext:" + ext);
        requestHandlers.getImage(request, response, pathname);
    }
    //处理CSS链接
    else if(typeConfirm(cssExt,request.url)){
        requestHandlers.getCSS(request, response, pathname);
    }
    //处理JS链接
    else if(typeConfirm(jsExt,request.url)){
        requestHandlers.getJS(request, response, pathname);
    }
    else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/html;charset=utf-8"});
        response.write("您访问的页面不存在！访问<a href='/'>首页</a>");
        response.end();
    }
}

http.createServer(onRequest).listen(8888);

function typeConfirm(type,url){
    var ext = path.extname(path.basename(url));
    if(type.contain(ext)){        
        return true;
    }
    return false;
}