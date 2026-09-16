const test = require('node:test')
const assert = require('node:assert')
const middleware = require('../utils/middleware') // Ajusta la ruta según tu proyecto

test('tokenExtractor extrae correctamente el token del header Authorization', () => {
    const req = {
        get: (headerName) => {
            if (headerName.toLowerCase() === 'authorization') {
                return 'Bearer eyJhbGciOiJIUzI1NiIsInR5cci6IkpXVCJ9.testtoken'
            }
            return null
        }
    }
    const res = {}
    let nextCalled = false
    const next = () => { nextCalled = true }

    middleware.tokenExtractor(req, res, next)

    assert.strictEqual(req.token, 'eyJhbGciOiJIUzI1NiIsInR5cci6IkpXVCJ9.testtoken')
    assert.strictEqual(nextCalled, true)
})

test('tokenExtractor asigna null u omite el token si no hay header Authorization', () => {
    const req = {
        get: () => null
    }
    const res = {}
    let nextCalled = false
    const next = () => { nextCalled = true }

    middleware.tokenExtractor(req, res, next)

    // Cambia undefined por null si tu middleware asigna null por defecto
    assert.strictEqual(req.token, null)
    assert.strictEqual(nextCalled, true)
})