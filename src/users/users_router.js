const UsersService = require('./users_service')
const express = require('express')
const path = require('path')

const usersRouter = express.Router()
const jsonParser = express.json()

usersRouter.route('/')
.get((req, res, next) => {
    UsersService.getAllUsers(req.app.get('db'))
    .then(users => {
        res.json(users)
    }).catch(next)
})
.post(jsonParser, (req, res, next) => {
    const { user_name, password} = req.body
    for (const field of ['user_name', 'password'])
        if(!req.body[field])
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            })
        const passwordError = UsersService.validatePassword(password)

        if(passwordError)
            return res.status(400).json({error: passwordError})
        UsersService.hasUserWithUserName(req.app.get('db'), user_name)
            .then(hasUserWithUserName => {
                if(hasUserWithUserName)
                    return res.status(400).json({
                        error: `That user name is already taken`
                    })
                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword
                        }
                        return UsersService.addNewUser(req.app.get('db'), newUser) 
                            .then(user => {
                                res
                                .status(201)
                                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                .json({
                                    id: user.id,
                                    user_name: user.user_name
                                })
                            })
                    })
            })
})
usersRouter.route('/:user_id')
.all((req, res, next) => {
    UsersService.getUserById(req.app.get('db'), req.params.user_id)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                error: {
                    message: 'User not found'
                }
            })
        }
        res.user = user
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
    res.json(res.user)
})
.delete((req, res, next) => {
    UsersService.deleteUser(req.app.get('db'), req.params.user_id)
    .then(() => {
        res.status(204).end()
    })
    .catch(next)
})
module.exports = usersRouter