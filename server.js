const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let players = []; //this sets up an empty array for players



io.on('connection', function(socket) {
    console.log('a user connected ' + socket.id);

    players.push(socket.id); //push the socket id to the players array

    if (players.length === 1) {
        io.emit('isPlayerA') // this makes the server emit to all of the clients (only one in this case), lets player know they are player a
    }

    socket.on('dealCards', function() {
        io.emit('dealCards') //emit is a way to send a message to all clients on server. 
    })

    socket.on('cardPlayed', function(gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA)
    })

    socket.on('disconnect', function() {
        console.log('a user disconnected ' + socket.id)
        players = players.filter(player => player !== socket.id) //filter the array so that the only elements in the array do not match the socket.id. This eliminates the disconnected player from the array.
    })
})

http.listen(3080, function() {
    console.log('server listening')
})