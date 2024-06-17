//Node Server which will handle Socket io connections



const io = require('socket.io')(5000, {
    cors: {
        origin: "*",
    },
});

const users = {};

io.on('connection', socket => {
    // When a new user joins, store the user's name by their socket ID and notify other users
    socket.on('new-user-joined', name => {
        console.log("new user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); // Notify all other users
    });

    // When a user sends a message, broadcast it to other users with the sender's name
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // When a user disconnects, remove them from the users list and notify other users
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
