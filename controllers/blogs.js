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

blogRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(savedBlog => {
            response.status(201).json(savedBlog)
        }).catch(error => {
            next(error)
        })
})

module.exports = blogRouter