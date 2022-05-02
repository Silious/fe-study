var events = require('events');

var emitter = new events.EventEmitter();
emitter.on('someEvent', function(art1, arg2){
    console.log(arg1)
})
emitter.on('someEvent', function(arg1){
    console.log(arg1)
})
emitter.emit('someEvent', 'arg1 参数', 'arg2')