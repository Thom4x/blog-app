const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app.js')
const api = supertest(app)
const User = require('../models/user')
const listHelper = require('./list_helper.js')


beforeEach(async () => {
    await User.deleteMany({}) // Limpiamos la BD de test

    for (const user of listHelper.users) {
        const userObject = new User(user)
        await userObject.save()
    }
})
describe('Solicitudes con los Usuarios', () => {
    test('Solicitud get para obtener todos los usuarios', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Usuario no valido', async () => {
        const usersAtStart = await listHelper.userDb()
        // que quiero? Preparo los datos
        const userFake = {
            username: "p",
            name: "palau",
            password: "franco"
        }
        // los consumo, es await?, que hago?
        const response =
            await api
                .post('/api/users')
                .send(userFake)
                .expect(422)
                .expect('Content-Type', /application\/json/)
        // hago la comparacion

        assert(response.body.error.includes("username and password must be at least 3 characters long"))
        const usersAtEnd = await listHelper.userDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('Que pasa si tengo espacios en blanco', async () => {
        const response = await api
            .post('/api/users')
            .send({
                username: "bu",
                name: "hlas",
                password: "adsgasg"
            })
        console.log(response.body, response.status)
    })
})
after(async () => {
    mongoose.connection.close()
})