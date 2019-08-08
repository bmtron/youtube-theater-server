const RoomsService = require('./rooms_service')
const express = require('express')
const path = require('path')

const roomsRouter = express.Router()
const jsonParser = express.json()
function serializeRooms(room) {
    return {
        id: room.id,
        name: room.name
    }
}
roomsRouter.route('/')
    .get((req, res, next) => {
        RoomsService.getAllRooms(req.app.get('db'))
        .then(rooms => {
            if(!rooms) {
                return res.status(404).json({
                    error: {
                        message: 'No rooms active'
                    }
                })
            }
            res.json(rooms.map(serializeRooms))
        }).catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newRoom = { name }
        for (const [key, value] of Object.entries(newRoom)) {
            if(value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing ${key} in request body`
                    }
                })
            }
        }
        RoomsService.addNewRoom(req.app.get('db'), newRoom)
        .then(room => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${room.id}`))
            .json({
                id: room.id,
                name: room.name,
            })
        }).catch(next)
    })
roomsRouter.route('/:room_id')
    .all((req, res, next) => {
        RoomsService.getRoomById(
            req.app.get('db'),
            req.params.room_id
        )
        .then(room => {
            if(!room) {
                return res.status(404).json({
                    error: {
                        message: 'Room not active'
                    }
                })
            }
            res.room = room
            next()
        }).catch(next)
    })
    .get((req, res, next) => {
        res.json(res.room)
    })
    .delete((req, res, next) => {
        RoomsService.deleteRoom(
            req.app.get('db'), 
            req.params.room_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = roomsRouter