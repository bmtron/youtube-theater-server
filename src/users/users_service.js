const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const bcrypt = require('bcryptjs')

const UsersService = {
    getAllUsers(db) {
        return db.select('*').from('theater_users')
    },
    addNewUser(db, newUser) {
        return db.insert(newUser).into('theater_users').returning('*')
                .then(rows => {
                    return rows[0]
                })
    },
    getUserById(db, id) {
        return db.from('theater_users')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteUser(db, id) {
        return db('theater_users')
            .where({id})
            .delete()
    },
    validatePassword(password) {
        if (password.length < 8 ) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 36) {
            return 'Password must be less than 36 characters'
        }
        if(password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with spaces'
        }
        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 uppercase, lower case, number and special character'
        }
        return null
    },
    hasUserWithUserName(db, user_name) {
        return db('theater_users')
            .where({user_name})
            .first()
            .then(user => !!user)
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    }
}

module.exports = UsersService