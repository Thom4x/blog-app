const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const listHelper = require('./list_helper.js')
const app = require('../app.js')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({}) // Limpiamos la BD de test

    // Insertamos los datos de prueba reales
    for (const blog of listHelper.blogs) {
        const blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test.only('Solicitud get para obtener todos lo blogs', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('la propiedad de identificador único debe llamarse id', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    // Verificamos que el primer blog tenga 'id' y no '_id'
    assert.strictEqual(response.body[0].hasOwnProperty('id'), true)
    assert.strictEqual(response.body[0].hasOwnProperty('_id'), false)
})

test.only('solicitud post para blogs', async () => {
    const object = {
        title: "fasfaf patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 1243,
    }

    const response =
        await api
            .post('/api/blogs')
            .send(object)
            .expect(201)
            .expect('Content-Type', /application\/json/)

    const blogsAtend = await listHelper.blogsDb()
    assert.strictEqual(blogsAtend.length, listHelper.blogs.length + 1)


    //const contents = blogsAtend.map(n => n.content)
    //assert(contents.includes('async/await simplifies making async calls'))

})

after(async () => {
    await mongoose.connection.close()
})