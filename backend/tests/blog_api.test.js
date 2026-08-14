const mongoose = require('mongoose')
const supertest = require('supertest')
const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../app') // Tu aplicación Express
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

describe('creación de un blog con token de autenticación', () => {
    let token = null

    beforeEach(async () => {
        // Limpiamos la base de datos y creamos un usuario de prueba
        await Blog.deleteMany({})
        await User.deleteMany({})

        const passwordHash = 'somehashedpassword' // O usa bcrypt si prefieres
        const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
        const savedUser = await user.save()

        // Creamos un token válido para este usuario usando la misma clave secreta de la app
        const userForToken = {
            username: savedUser.username,
            id: savedUser._id,
        }
        token = jwt.sign(userForToken, process.env.SECRET)
    })

    test('un blog válido puede ser añadido con un token válido en el header Authorization', async () => {
        const newBlog = {
            title: 'Prueba de token middleware',
            author: 'Desarrollador',
            url: 'https://ejemplo.com/middleware',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) // Enviamos el token extraído por el middleware
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await Blog.find({})
        expect(blogsAtEnd).toHaveLength(1)
        expect(blogsAtEnd[0].title).toBe('Prueba de token middleware')
    })

    test('falla con el código 401 si no se provee un token', async () => {
        const newBlog = {
            title: 'Blog sin token',
            author: 'Anónimo',
            url: 'https://ejemplo.com/sin-token',
            likes: 0
        }
        await api
            .post('/api/blogs') // No enviamos token
            .send(newBlog)
            .expect(401) // No autorizado porque el middleware no encontró/validó el token

        const blogsAtEnd = await Blog.find({})
        expect(blogsAtEnd).toHaveLength(0)
    })
})