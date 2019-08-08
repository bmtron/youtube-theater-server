const app = require('../src/app')
const knex = require('knex')

describe('Users service', function() {
    let db

    const testUsers = [{
        id: 1,
        user_name: 'bmtron',
        password: 'Goalie#30'
    },
    {
        id: 2,
        user_name: 'tmitch',
        password: 'Tyler#111'
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

    before('cleanup', () => db.raw(`TRUNCATE theater_users, theater_rooms RESTART IDENTITY CASCADE`))

    afterEach('cleanup', () => db.raw(`TRUNCATE theater_users, theater_rooms RESTART IDENTITY CASCADE`))

    describe('GET /api/users', () => {
        context('there are no users', () => {
            it('returns 200 and []', () => {
                return supertest(app)
                .get('/api/users')
                .expect(200, [])
            })
        })
        context('there are users in the db', () => {
            beforeEach('add users to db', () => db.into('theater_users').insert(testUsers))
            it(`responds 200 with a list of users`, () => {
                return supertest(app)
                .get('/api/users')
                .expect(200, testUsers)
            })
        })
    })
    context('happy path', () => {
        it(`responds 200 storing bcrypted password`, () => {
            const newUser = {

                user_name: 'test user_name',
                password: '11AAaa!!'
            }
            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_name).to.eql(newUser.user_name)
                    expect(res.body).to.not.have.property('password')
                    expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                })
                .expect(res => 
                    db
                    .from('theater_users')
                    .select('*')
                    .where({id: res.body.id})
                    .first()
                    .then(row => {
                        expect(row.user_name).to.eql(newUser.user_name)
                    })
                )
        })
    })
})