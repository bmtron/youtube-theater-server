const app = require('../src/app')
const helpers = require('./test-helpers')
const knex = require('knex')

describe('Rooms service', function() {
    let db

    const testRooms = [
        {
            id: 1,
            owner: 1,
            name: 'Test Room 1',
            videos: 'Test'
        },
        {
            id: 2,
            owner: 2,
            name: 'Test Room 2',
            videos: 'Test'
        }
    ]
    const testUsers = [{
        id: 1,
        user_name: 'bmtron',
        full_name: 'Brendan',
        password: 'g'
    },
    {
        id: 2,
        user_name: 'tmitch',
        full_name: 'Tyler',
        password: 'r'
    }
]
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw(`TRUNCATE theater_users, theater_rooms, theater_user_access RESTART IDENTITY CASCADE`))

    afterEach('cleanup', () => db.raw(`TRUNCATE theater_users, theater_rooms, theater_user_access RESTART IDENTITY CASCADE`))
    beforeEach('insert users', () => db.into('theater_users').insert(testUsers))
    describe(`GET /api/rooms`, () => {

        context('there are rooms in the database', () => {
            beforeEach('insert test data', () => db.raw(`INSERT INTO theater_rooms (id, name, videos, owner) VALUES ('1', 'Room 1', 'Test1', '1')`))
            const expectedRooms = [
                {
                    id: 1,
                    name: 'Room 1',
                    videos: 'Test1',
                    owner: 1
                },
            ]

            it(`responds with 200 and expected rooms`, () => {
                return supertest(app)
                    .get(`/api/rooms`)
                    .expect(200, expectedRooms)
            })
        })

        context('there is no data in the database', () => {
            it(`responds 200 and list of available rooms`, () => {
                return supertest(app)
                    .get(`/api/rooms`)
                    .expect(200, [])
            })
        })
    })
    describe(`GET /api/rooms/:room_id`, () => {
        context('there are no rooms in the database', () => {
            it(`responds 400 with error`, () => {
                return supertest(app)
            .get('/api/rooms/1')
            .expect(404, { error: {
                message: 'Room not active'
            }})
            })
        })
        context(`there is a room in the database`, () => {
            
            beforeEach('insert test data', () => db.raw(`INSERT INTO theater_rooms (id, name, videos, owner) VALUES ('1', 'Room 1', 'Test1', '1'), ('2', 'Room 2', 'Test2', '2')`))
            it(`responds with 200 and room info`, () => {
                const expectedRoom = {
                    id: 1,
                    name: 'Room 1',
                    videos: 'Test1',
                    owner: 1
                }
                return supertest(app)
                    .get('/api/rooms/1')
                    .expect(200, expectedRoom)
            })
        })
    })
    describe('POST /api/rooms', () => {
        it('creates a room, responding with 201 and the room', () => {
            const newRoom = {
                videos: 'Test',
                name: 'Test Room',
                owner: 1
            }

            return supertest(app)
                .post('/api/rooms')
                .send(newRoom)
                .expect(201)
                .expect(res => {
                    expect(res.body.videos).to.eql(newRoom.videos)
                    expect(res.body.name).to.eql(newRoom.name)
                    expect(res.body.owner).to.eql(newRoom.owner)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/rooms/${res.body.id}`)
                })
                .then(postRes => {
                    supertest(app)
                    .get(`/api/rooms/${postRes.body.id}`)
                    .expect(postRes.body)
                })
        })
        const requiredFields = ['name', 'videos', 'owner']

        requiredFields.forEach(field => {
            const newRoom = {
                name: 'Test',
                videos: 'Test',
                owner: 1
            }
            it('responds with 400 and error for missing fields', () => {
                delete newRoom[field]
                return supertest(app)
                .post('/api/rooms')
                .send(newRoom)
                .expect(400, {
                    error: {
                        message: `Missing ${field} in request body`
                    }
                })
            })
        })
    })
    describe('DELETE /api/rooms/:room_id', () => {
        
        context('the room exists', () => {
            beforeEach('insert test rooms', () => db.into('theater_rooms').insert(testRooms))
            it(`should return 204 and remove the room`, () => {
                const roomToRemove = 1
                const expectedRooms = testRooms.filter(item => item.id !== roomToRemove)

                return supertest(app)
                .delete(`/api/rooms/${roomToRemove}`)
                .expect(204)
                .then(res => {
                    supertest(app)
                    .get('/api/rooms')
                    .expect(expectedRooms)
                })
            })
        })
        context('given no rooms', () => {
            it(`responds with 404`, () => {
                return supertest(app)
                .delete('/api/rooms/1333332')
                .expect(404, {
                    error: {
                        message: 'Room not active'
                    }
                })
            })
        })
    })
})