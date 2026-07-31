const { min } = require('lodash')
const mongoose = require('mongoose')
const config = require('../utils/config')
// Conectar
mongoose.connect(config.MONGODB_URI)

// Crear esquema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
})

// Transformar el objeto a JSON
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // el passwordHash no debe mostrarse
        delete returnedObject.passwordHash
    }
})

// Crear modelo
module.exports = mongoose.model('User', userSchema)
