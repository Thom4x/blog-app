# Blog App

Aplicación para gestionar blogs. Incluye un frontend en React, una API en
Node.js/Express y persistencia en MongoDB.

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Creación, edición, likes y eliminación de blogs.
- Autenticación mediante JWT.
- Rutas protegidas según el usuario autenticado.
- Pruebas unitarias, de integración y E2E.

## Requisitos

- Node.js y npm
- MongoDB local o MongoDB Atlas

## Instalación

Instala las dependencias desde la raíz del proyecto:

```bash
npm install
npm install --prefix server
npm install --prefix client
npm install --prefix e2e
```

Crea el archivo `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/blogapp
TEST_MONGODB_URI=mongodb://localhost:27017/blogapp-test
SECRET=una_clave_secreta
PORT=3003
```

`TEST_MONGODB_URI` debe apuntar a una base de datos distinta de
`MONGODB_URI`.

## Uso

### Desarrollo

Inicia el servidor y el cliente:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3003`

### Producción

```bash
npm run build
npm start
```

## Pruebas

Ejecutar todas las pruebas unitarias:

```bash
npm test
```

Solo backend:

```bash
npm test --prefix server
```

Solo frontend:

```bash
npm test --prefix client
```

Pruebas E2E:

```bash
npm run build
npm run test:e2e
```

Las pruebas E2E usan el puerto `3003` y `TEST_MONGODB_URI`.

## Estructura

```text
client/   Frontend en React y Vite
server/   API, modelos y pruebas del backend
e2e/      Pruebas end-to-end con Playwright
```

## Tecnologías

React, Vite, Express, MongoDB, Mongoose, JWT, bcrypt, Vitest y Playwright.

## Autor

Tomas Holguin Serna - [Thom4x](https://github.com/Thom4x)
