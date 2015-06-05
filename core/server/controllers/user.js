/**
 * Created by 陈瑞 at 2015/6/3.
 */

var path          = require('path'),
    fs            = require('fs'),
    _             = require('lodash'),
    bytes         = require('bytes'),
    errors        = require('../../shared/errors'),
    config        = require('../../shared/config'),
    utils         = require('../../server/utils/index'),
    userControllers;
    avatar = {},
    //所有的用户
    totalusers = {},
    //某一房间里的所有用户
    users ={},
    //所有的房间
    totalrooms = {},
    //每个用户有一个"rooms"，存有用户所在的房间
    rooms = {},
    username = {},
    signature = {};

userControllers = {
    // Route: checkNickname
    // Event: check nickname
    // Data: {nickname: string}
    checkNickname: function (socket) {
        return function (data) {
            var res;
            //在所有的用户中检查该昵称是否已被使用
            if (!totalusers[data.nickname]) {
                res = {success: true};
            } else {
                res = {success: false};
            }
            socket.emit("check nickname", res);
        }
    },

    // Route: initializeUser
    // Event: initialize user
    // Data: {nickname: string, signature: string, avatar: png}
    initializeUser: function (socket) {
        return function (data) {
            //在所有的用户中检查该昵称是否已被使用
            if (!totalusers[data.nickname]) {
                if (!data.signature) {
                    data.signature = "please write your signature";
                }
                else{
                    signature[socket.id] =data.signature;
                }
                if (!data.avatar) {
                    data.avatar = "resources/images/default.png";
                }
                else{
                    avatar[socket.id] = data.avatar;
                }
                //users[data.nickname] = data;
                username[socket.id] = data.nickname;
                rooms[socket.id] = [];
                socket.emit('initialize user', {success: true, username: data.nickname, signature:data.signature, avatar: data.avatar});
                //socket.broadcast.emit('user join', {user: data});
            } else {
                socket.emit('initialize user', {success: false, message: 'this name has been used'});
            }
        }
    },
    /*
     // Route: signOff
     // Event: disconnect
     signOff: function (socket) {
     return function () {
     for (var i in rooms) {
     var index = rooms[socket.rooms[i]]['users'].indexOf(socket.username);
     utils.delElByIndex(rooms[socket.rooms[i]]['users'], index);
     socket.leave(socket.rooms[i]);

     if (rooms[socket.rooms[i]]['users'].length==0) {
     delete rooms[socket.rooms[i]];
     } else {
     socket.to(socket.rooms[i]).emit("someone leave room", {room: socket.rooms[i], user: socket.username});
     }
     }
     if (users) {
     delete users[socket.username];

     socket.broadcast.emit('user leave', {nickname: socket.username});
     }
     }
     },
     */
    // Route: createRoom
    // Event: create room
    // Data: {name: string, password: string(optional)}
    createRoom: function (socket) {
        return function (data) {
            //用户创建房间时检查name名字的房间是否已被创建
            if (rooms[socket.id][data.name]) {
                //返回消息：该房间已存在
                socket.emit('create room', {success: false, message: "this room is existed"});
            } else {
                //password:加入房间的密码（可选）
                if (data.password) {
                    rooms[socket.id][data.name] = {password: data.password, users:username[socket.id]};
                    totalrooms[data.name] = {password: data.password, users:username[socket.id]};
                } else {
                    rooms[socket.id][data.name] = {users:username[socket.id]};
                    totalrooms[data.name] = { users:username[socket.id]};
                }
                socket.join(data.name);
                //将新创建的房间加入创建该房间用户的房间队列中
                socket.rooms.push(data.name);
                //将新创建的房间加入总的房间队列中
                totalrooms.push(data.name);
                socket.emit('create room', {success: true, room: data.name});
            }
        }
    },

    // Route: joinRoom
    // Event: join room
    // Data: {name: string, password: string(if required)}
    joinRoom: function (socket) {
        return function (data) {
            //在所有的房间中检查要加入的房间是否存在
            if (totalrooms[data.name]) {
                if (totalrooms[data.name]['password'] == data.password) {

                    rooms[socket.id][data.name]['users'].push(username[socket.id]);
                    totalrooms[data.name]['users'].push(username[socket.id]);
                    socket.join(data.name);

                    /*var roomUsers = {};
                     for (var item in rooms[data.name]['users']) {
                     roomUsers[rooms[data.name]['users'][item]] = users[rooms[data.name]['users'][item]];
                     }*/
                    rooms[socket.id].push(data.name);
                    socket.emit('join room', {success: true, room: data.name, users: totalrooms[data.name]['users']});
                } else {
                    //返回消息：密码不正确
                    socket.emit('join room', {success: false, message: "your password is throng"});
                }
            } else {
                //返回消息：该房间不存在
                socket.emit('join room', {success: false, message: "this room does not exist"});
            }
        }
    },

    // Route: leaveRoom
    // Event: leave room
    // Data: {name: string}
    leaveRoom: function (socket) {
        return function (data) {
            //将该用户从房间包含的用户中删除
            var index = totalrooms[data.name]['users'].indexOf(username[socket.id]);
            utils.delElByIndex(totalrooms[data.name]['users'], index);
            socket.leave(data.name);
            //将该房间从用户加入的房间中删除
            index = rooms[socket.id].indexOf(data.name);
            utils.delElByIndex(rooms[socket.id], index);


            if (totalrooms[data.name]['users'].length==0) {
                //将空房间删除
                index = totalrooms.indexOf(data.name);
                utils.delElByIndex(totalrooms,index);
            } else {
                socket.to(data.name).emit("someone leave room", {room: data.name, user: username[socket.id]});
            }
            socket.emit("leave room", {success: true, room: data.name});
        }
    },

    // Route: sendTextMessage
    // Event: send text message
    // Data: {room: string, nickname: string, avatar: png, text: string}
    sendTextMessage: function (socket) {
        return function (data) {
            //检查该房间是否存在
            if(totalrooms[data.room]){
                //检查该用户是否位于该房间
                if(totalrooms[data.room]['users'].indexOf(data.nickname)){
                    socket.to.(data.room).emit('send text message',{success: true, sender: data.nickname, room: data.room, avatar: data.avatar, text: data.text});
                }else{
                    socket.emit('receive text message',{success: false, message: ' this room do not have this user'});
                }
            }else{
                socket.emit('receive text message',{success: false, message: 'do not have this room'});
            }
            //socket.emit('send text message', data);
        }
    },

    // Route: shareFile
    // Event: share file
    // Data: {room: string, nickname: string, avatar: string, content: object}
    shareFile: function (socket) {
        return function (stream, data) {
             //文件path
            var filePath = path.join(config.paths.contentPath, 'upload/shared', data.room, data.content.name),
            //通过文件path得到directory
                dirPath = path.dirname(filePath);
            //检查文件是否存在
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }

            stream.on('end', function () {
                data.content = {name: data.content.name, type: data.content.type, size: bytes(data.content.size), link: "upload/shared/"+data.room+"/"+data.content.name};
                socket.emit('share file', data);
                /*if (data.room == 'default-room') {
                 socket.broadcast.emit('receive file message', data);
                 } else {
                 socket.to(data.room).emit('receive file message', data);
                 }*/
                socket.to(data.room).emit('receive file message', data);
            });

            stream.pipe(fs.createWriteStream(filePath));
        }
    },

    // Route: sendAudioMessage
    // Event: send audio message
    // Data: {room: string, nickname: string, avatar: string, content: object}
    // object: {type: string, dataURL: string}
    sendAudioMessage: function (socket) {
        return function(data) {
            var fileName = utils.uid(10)+".wav",
                filePath = path.join(config.paths.contentPath, 'upload/audio', data.room, fileName),
                dirPath = path.dirname(filePath),
                dataURL = data.content.dataURL,
                fileBuffer;


            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }

            dataURL = dataURL.split(',').pop();
            fileBuffer = new Buffer(dataURL, 'base64');
            fs.writeFileSync(filePath, fileBuffer);

            data.content = {link: 'upload/audio/'+data.room+'/'+fileName};
            socket.emit('send audio message', data);
            /*if (data.room == 'default-room') {
             socket.broadcast.emit('receive audio message', data);
             } else {
             socket.to(data.room).emit('receive audio message', data);
             }*/
            socket.to(data.room).emit('receive audio message', data);
        }
    }
};

module.exports = userControllers;
