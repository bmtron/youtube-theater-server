const app = require('./app')
const { PORT, DB_URL } = require('./config')
const knex = require('knex')

const server = require('http').createServer(app)
const socketIo = require('socket.io')
const io = socketIo(server)


const db = knex({
    client: 'pg',
    connection: DB_URL
})

io.on("connection", socket => {
   console.log('a user connected')
    
    socket.on("disconnect", () => console.log("Client disconnected")) 

    socket.on('room', function(data) {
        socket.join(data.room)
        io.in(data.room).emit('welcome', `Welcome to room ${data.room}`)
        io.in(data.room).emit('join', `${data.user} has joined the room.`)
    })
    socket.on('leave room', (data) => {
        socket.leave((data.room))
    })
    socket.on('message', function(data) {
        io.in(data.room).emit('receive message', data)
        console.log(data)
    })
    socket.on('video source', function(data) {
        console.log(data)
        io.in(data.room).emit('update vid', data)
    })
    socket.on('pause', function(data) {
        console.log(data)
        io.in(data.room).emit('pause vid', data)
    })
});


app.set('db', db)
server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})