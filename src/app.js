require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const roomsRouter = require('./rooms/room_router')
const usersRouter = require('./users/users_router')
const authRouter = require('./auth/auth-router')
const socketIo = require('socket.io')
const axios = require('axios')

const app = express()

const morganOption = (NODE_ENV === 'production' ? 'tiny' : 'common')

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
app.use('/api/rooms', roomsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.get('/', (req, res) => {
    res.send('Hello, boilerplate!').status(200)
})


app.use(function errorHandler(error, req, res, next) {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    }
    else {
        console.log(error)
        response = { message: error.message, error}
    }
    res.status(500).json(response)
})
module.exports = app