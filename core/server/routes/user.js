/**
 * Created by 陈瑞 on 2015/7/12.
 */
var ss         = require('socket.io-stream'),
    user       = require('../controllers/user'),
    userRoutes;

userRoutes = function (socket) {

    socket.on('check username', user.checkUsername(socket));

    socket.on('initialize user', user.initializeUser(socket));

    //socket.on('disconnect', user.signOff(socket));

    socket.on('create room', user.createRoom(socket));

    socket.on('join room', user.joinRoom(socket));

    //socket.on('double chatter',user.doublePersonChat(socket));

    socket.on('leave room', user.leaveRoom(socket));

    socket.on('send text message', user.sendTextMessage(socket));

    ss(socket).on('share file', user.shareFile(socket));

    socket.on('send audio message', user.sendAudioMessage(socket));

};

module.exports = userRoutes;
