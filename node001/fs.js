var fs = require('fs');


// 异步读取
// fs.readFile('input.txt', function (err, data) {
//     if (err) {
//         return console.error(err);
//     }
//     console.log("异步读取: " + data.toString());
//  });
// fs.readdir(__dirname,)
fs.stat(__filename, (err, res)=>{
    console.log(res)
})
console.log(__dirname,2,__filename)