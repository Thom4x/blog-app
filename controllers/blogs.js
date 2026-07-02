const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blog = await Blog.find({})
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

    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'title or url missing'
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})




module.exports = blogRouter