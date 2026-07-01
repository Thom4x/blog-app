const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.connect(config.MONGODB_URI)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        console.log("¡Transformando!")
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)

