var app=require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
//var MongoClient = require('mongodb').MongoClient;//

var port = process.env.PORT || 3000;

app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
});
var url = 'mongodb://dbuser:root123@ds161304.mlab.com:61304/colors';
var color = mongoose.model('colors', {color: String});
mongoose.connect(url, function(err, color){
    if(err){
        console.log(err);
    }else{
        console.log("congrats!");
        //var k = new cmodel
        io.on('connection', function(socket){
            console.log('connected to socket');
            var latest = mongoose.model('colors').findOne({}, {}, { sort: { '_id' : -1 } }, function(err, post) {
                console.log(post);
                if (err) throw err;
                latest.count(function (err, count) {
                    if (!err && count !== 0) {
                        io.emit('pressed button', post.color);
                    }else if(count===0){
                        console.log("database empty!");
                        io.emit('pressed button', 'btn btn-danger');
                    }
                 });
            });
            socket.on('pressed button', function(msg){
                io.emit('pressed button', msg);
                //mongoose.model('colors').collection.remove();
                var input = msg.split(" ");
                var enter = input[0]+" "+input[1];
                mongoose.model('colors').collection.insert({color:enter}, function(err,res){
                    console.log("inserted to db "+enter);
                });
                        
            });
        });
    }  
});

http.listen(port, function(){
    console.log('Listening on port');
});
