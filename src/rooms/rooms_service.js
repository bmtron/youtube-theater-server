const xss = require('xss')

const RoomsService = {
    getAllRooms(db) {
        return db.select('*').from('theater_rooms')
    },
    getRoomById(db, id) {
        return db.from('theater_rooms')
                 .select('*')
                 .where('id', id)
                 .first()
    },
    addNewRoom(db, newRoom) {
        return db.insert(newRoom).into('theater_rooms').returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteRoom(db, id) {
        return db('theater_rooms')
        .where({id})
        .delete()
    },
    hasRoomWithRoomName(db, name) {
        return db('theater_rooms')
            .where({name})
            .first()
            .then(room => !!room)
    },
}

module.exports = RoomsService