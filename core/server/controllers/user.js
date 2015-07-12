/**
 * Created by 陈瑞 on 2015/7/12.
 */

var path          = require('path'),
    fs            = require('fs'),
    _             = require('lodash'),
    bytes         = require('bytes'),
    errors        = require('../../shared/errors'),
    config        = require('../../shared/config'),
    utils         = require('../../shared/utils'),
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
    nickname = {},
    signature = {};

userControllers = {
    // Route: checkNickname
    // Event: check nickname
    // Data: {username: string}
    checkUsername: function (socket) {
        return function (data) {
            var res;
            if (!totalusers[data.username]) {             //在所有的用户中检查该昵称是否已被使用
                res = {success: true};
            } else {
                res = {success: false};
            }
            socket.emit("check nickname ended", res);
        }
    },

    // Route: initializeUser
    // Event: initialize user
    // Data: {username: string, nickname: string, signature: string, avatar: png}
    initializeUser: function (socket) {
        return function (data) {
            //在所有的用户中检查该昵称是否已被使用
            if (!totalusers[data.username]) {
                if (!data.signature) {
                    data.signature = "please write your signature";
                } else{
                    socket.signature =data.signature;
                }
                if (!data.avatar) {
                    data.avatar = "resources/images/default.png";
                } else{
                    socket.avatar = data.avatar;
                }
                socket.nickname = data.nickname;
                socket.rooms = {};
                socket.emit('initialize user ended', {success: true, nickname: data.nickname, signature:data.signature, avatar: data.avatar});
                //socket.broadcast.emit('user join', {user: data});
            } else {
                socket.emit('initialize user', {success: false, message: 'this username has been used'});
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
            if (totalrooms[data.name]) {
                //返回消息：该房间已存在
                socket.emit('create room', {success: false, message: "this room has existed"});
            } else {
                socket.join(data.name);
                //password:加入房间的密码（可选）
                if (data.password) {
                    //将新创建的房间加入创建该房间用户的房间队列中
                    socket.rooms.push(data.name);
                    //将新创建的房间加入总的房间队列中
                    totalrooms.push(data.name);
                    totalrooms[data.name] = {password: data.password, users:{}};
                    totalrooms[data.name]['users'].push(data.name);
                } else {
                    //将新创建的房间加入创建该房间用户的房间队列中
                    socket.rooms.push(data.name);
                    //将新创建的房间加入总的房间队列中
                    totalrooms.push(data.name);
                    totalrooms[data.name] = {users:{}};
                    totalrooms[data.name]['users'].push(data.name);
                }
                socket.emit('create room ended', {success: true, room: data.name});
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
                if(totalrooms[data.name]['password']){
                    if (totalrooms[data.name]['password'] == data.password) {
                        socket.rooms.push(data.name);
                        totalrooms[data.name]['users'].push(socket.username)
                        socket.join(data.name);
                        socket.emit('join room ended', {success: true, room: data.name, users: totalrooms[data.name]['users']});
                    } else {
                        //返回消息：密码不正确
                        socket.emit('join room', {success: false, message: "the password is wrong"});
                    }
                }else{
                    socket.rooms.push(data.name);
                    totalrooms[data.name]['users'].push(socket.username)
                    socket.join(data.name);
                    socket.emit('join room ended', {success: true, room: data.name, users: totalrooms[data.name]['users']});
                }
            } else {
                socket.emit('join room ended', {success: false, message: "this room dose not exist"});                                    //返回消息：该房间不存在
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
            //将该房间从用户加入的房间中删除
            index = socket.rooms.indexOf(data.name);
            utils.delElByIndex(socket.rooms, index);
            socket.leave(data.name);

            if (totalrooms[data.name]['users'].length==0) {
                //将空房间删除
                index = totalrooms.indexOf(data.name);
                utils.delElByIndex(totalrooms,index);
            } else {
                socket.to(data.name).emit("someone leave room", {room: data.name, user: socket.username});
            }
            socket.emit("leave room ended", {success: true, room: data.name, user: socket.username});
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
                    socket.to.(data.room).emit('send text message ended',{success: true, sender: data.username, room: data.room, text: data.text});
                }else{
                    socket.emit('send text message ended',{success: false, message: ' this room does not have this user'});
                }
            }else{
                socket.emit('send text message ended',{success: false, message: 'this room dose not exist'});
            }
        }
    },

    // Route: shareFile
    // Event: share file
    // Data: {room: string, nickname: string, avatar: string, content: object}
    shareFile: function (socket) {
        return function (stream, data) {
            //文件path
            var filePath = path.join(config.paths.contentPath, 'upload/shared', data.room, data.content.name),
                dirPath = path.dirname(filePath);

            //检查文件是否存在
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }

            stream.on('end', function () {
                data.content = {name: data.content.name, type: data.content.type, size: bytes(data.content.size), link: "upload/shared/"+data.room+"/"+data.content.name};
                socket.emit('share file', data);
                socket.to(data.room).emit('share file ended', data);
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
            socket.emit('send audio message ended', data);
            socket.to(data.room).emit('receive audio message ended', data);
        }
    }
};

module.exports = userControllers;
