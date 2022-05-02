var http = require("http");
var url = require('url');
var util = require('util');
var querystring = require('querystring');

var postHTML = 
  '<html><head><meta charset="utf-8"><title>菜鸟教程 Node.js 实例</title></head>' +
  '<body>' +
  '<form method="post">' +
  '网站名： <input name="name"><br>' +
  '网站 URL： <input name="url"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';

http
  .createServer(function (req, res) {
    // 发送 HTTP 头部
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    // res.writeHead(200, { "Content-Type": "text/plain" });

    // res.end("Hello World\n");
    // res.end(util.inspect(url.parse(request.url, true)))
    var body = ''
    req.on('data', function(chunk){
      body += chunk;
    })
    req.on('end',function(){
      // 解析参数
      body = querystring.parse(body);
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
      if(body.name && body.url){
        res.write("网站名：" + body.name);
        res.write("<br>");
        res.write("网站 URL：" + body.url);
      }else{
        res.write(postHTML);
      }
      res.end()
    })

  })
  .listen(8888);

console.log("Server running at http://127.0.0.1:8888/");
