const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { getTokenFrom } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blog = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blog)

    //Blog
    //    .find({})
    //    .then(blogs => {
    //        response.json(blogs)
    //    }).catch((error) => {
    //        response.status(404).send({ error: "missing..." })
    //    })
})

blogRouter.post('/', async (request, response) => {
    const body = request.body
    // Obtener el usuario autenticado del objeto de solicitud

    // Check if the user is authenticated STEP 1
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    // Buscar el usuario en la base de datos usando el ID del token decodificado STEP 2
    const user = await User.findById(decodedToken.id)
    // como usamos el middleware? 
    console.log('Usuario autenticado:', user.username)


    //if (!body.title || !body.url) {
    //    return response.status(400).json({
    //        error: 'title or url missing'
    //    })
    //}

    // Crear un nuevo blog y asociarlo con el usuario STEP 3

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    // 1. Verificar y decodificar el token primero

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    // 2. Buscar el blog por su ID y verificar si existe
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    // 3. Verificar si el usuario que intenta eliminar el blog es el mismo que lo creó
    if (blog.user.toString() !== decodedToken.id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete a blog' })
    }

    // 4. Si todo está bien, eliminar el blog
    await Blog.findByIdAndDelete(request.params.id)
    response.json({ message: 'blog deleted successfully' }).status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const { likes } = request.body;

    // Update the likes of the blog with the given ID
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes },
        { new: true, runValidators: true, context: 'query' }
    ).populate('user', { username: 1, name: 1 });

    console.log("Updated blog:", updatedBlog);

    if (updatedBlog) {
        response.json(updatedBlog);
    } else {
        response.status(404).end();
    }
});


module.exports = blogRouter