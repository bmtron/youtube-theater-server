function makeRoomsArray() {
    return [{
        id: 1,
        name: 'Room 1',
        videos: ['Test1', 'Test2']
    },
    {
        id: 2,
        name: 'Room 2',
        videos: ['Test3', 'Test4']
    }]
}

function cleanTables(db) {
    return db.transaction(trx => {
        trx.raw(
            `TRUNCATE
                theater_rooms,
                theater_users,
                theater_user_access
                `
        )
        .then(() => {
            Promise.all([
                trx.raw(`ALTER SEQUENCE theater_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE theater_rooms_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE theater_user_access_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('theater_users_id_seq', 0)`),
                trx.raw(`SELECT setval('theater_rooms_id_seq', 0)`),
                trx.raw(`SELECT setval('theater_user_access_id_seq', 0)`)
            ])
        })
    })
}
function makeExpectedRoom(room) {
    return {
        id: room.id,
        name: room.name,
        videos: room.videos
    }
}

module.exports = {
    makeRoomsArray,
    cleanTables,
    makeExpectedRoom
}