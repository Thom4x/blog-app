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

test('si la propiedad likes falta en la solicitud, se establece en 0 por defecto', async () => {
    const blogSinLikes = {
        title: "Título de prueba sin likes",
        author: "Tomas Holguin",
        url: "http://test-url.com"
    }

    const response = await api
        .post('/api/blogs')
        .send(blogSinLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    // Verificamos que el blog retornado tenga likes: 0
    assert.strictEqual(response.body.likes, 0)
})

test('verificar si falta title o url en la solicitud', async () => {
    const blogSinLikes = {
        author: "Tomas Holguin",
        url: "http://test-url.com"
    }

    const response = await api
        .post('/api/blogs')
        .send(blogSinLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const find = await listHelper.verifyTitleUrl(blogSinLikes.title, blogSinLikes.url)
    assert.strictEqual(find, undefined)

})

describe('eliminacion por id', () => {
    test('eliminacion de una nota', async () => {
        const blogsAtStart = await listHelper.blogsDb()
        const blogToDelete = blogsAtStart[0]

        const response = await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await listHelper.blogsDb() // actualizamos la lista de blogs después de la eliminación
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

        const contents = blogsAtEnd.map(r => r.content) // Creamos un array con los contenidos de los blogs restantes
        assert(!contents.includes(blogToDelete.content)) // Verificamos que el contenido del blog eliminado ya no esté presente en la lista final
    })
})

after(async () => {
    await mongoose.connection.close()
})