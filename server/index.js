const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 app.use(cors());

let config = {};
config.port = 3001;

const server = require('http').Server(app);
const io = require('socket.io')(server);
var users = [];
io.on('connection', (socket) => { 
    console.log('connected socket', users);
    socket.on('setUsername', function(data) {
        console.log('user', users)
        if(users.indexOf(data) > -1) {
           socket.emit('userExists', {data: data , msg: ' username is taken! Try some other username.'});
        } else {
           users.push(data);
           socket.emit('userSet', {username: data});
        }
     });
     socket.on('disconnect', (data)=>{
        users.splice(t.indexOf(data), 1);
     });
    socket.on('msg', function(data) {
        io.sockets.emit('newmsg', data);
     })
 });

 server.listen(config.port);

console.log('Server started on', config.port, 'port');