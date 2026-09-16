# Blog App

Este repositorio corresponde a una aplicación de blogs desarrollada como parte del curso de Full Stack Open. La aplicación combina un frontend en React con un backend en Node.js/Express y una base de datos MongoDB, aplicando conceptos de autenticación, rutas protegidas, pruebas y despliegue.

## Descripción

La aplicación permite:

- registrar usuarios
- iniciar sesión con JWT
- visualizar la lista de blogs
- crear nuevos blogs
- dar like a blogs
- eliminar blogs creados por el usuario autenticado
- navegar entre pantallas del frontend con React Router

Es un ejemplo clásico de una app full stack con separación clara entre cliente y servidor.

---

## Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router DOM
- Material UI
- Axios
- Vitest + Testing Library

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- Supertest

### Herramientas de desarrollo

- concurrently
- nodemon
- ESLint

---

## Arquitectura del proyecto

La aplicación está dividida en dos partes principales:

- `client/`: interfaz de usuario en React
- `server/`: API REST y lógica de negocio
- `package.json` en la raíz: inicio conjunto de frontend y backend

### Flujo general

1. El usuario se registra o inicia sesión desde la interfaz.
2. El backend valida las credenciales y devuelve un token JWT.
3. El frontend almacena el token y lo envía en peticiones protegidas.
4. El servidor comprueba el token antes de permitir crear o borrar blogs.
5. Los blogs se guardan en MongoDB y se devuelven al frontend en JSON.

---

## Estructura del repositorio

```text
blogapp/
├── client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── controllers/
│   ├── models/
│   ├── requests/
│   ├── tests/
│   ├── utils/
│   ├── app.js
│   ├── index.js
│   └── package.json
├── e2e/
│   ├── tests/
│   └── playwright.config.js
├── package.json
├── README.MD
└── .gitignore
```

---

## Requisitos previos

Necesitarás tener instalado:

- Node.js
- npm
- MongoDB (local o MongoDB Atlas)

---

## Instalación

Desde la raíz del proyecto:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

Esto instala las dependencias del proyecto principal, del backend y del frontend.

---

## Variables de entorno

Crea un archivo `.env` dentro de la carpeta `server/` con algo similar a:

```env
MONGODB_URI=mongodb://localhost:27017/blogapp
TEST_MONGODB_URI=mongodb://localhost:27017/blogapp-test
SECRET=tu_clave_secreta_muy_segura
PORT=3001
```

> La variable `SECRET` se usa para firmar los tokens JWT.

---

## Cómo arrancar la aplicación

### Desarrollo local

En la raíz:

```bash
npm run dev
```

Este comando usa `concurrently` para lanzar simultáneamente:

- backend en el puerto 3001
- frontend con Vite en el puerto 5173

### Producción

Primero construye el frontend:

```bash
npm run build
```

Y luego inicia el backend en modo producción:

```bash
npm start
```

El servidor sirve la versión compilada del frontend desde `client/dist`.

---

## Endpoints principales de la API

### Usuarios

- `GET /api/users` — lista los usuarios
- `POST /api/users` — crea un nuevo usuario

### Login

- `POST /api/login` — autentica al usuario y devuelve un token JWT

### Blogs

- `GET /api/blogs` — devuelve todos los blogs
- `POST /api/blogs` — crea un blog asociado al usuario autenticado
- `PUT /api/blogs/:id` — actualiza un blog, por ejemplo el número de likes
- `DELETE /api/blogs/:id` — elimina un blog si el usuario es el creador

---

## Autenticación

La autenticación se gestiona con JWT.

Cuando un usuario inicia sesión, el backend genera un token con su `id` y `username`. Ese token se envía al frontend y se incluye en las cabeceras de las peticiones que requieren permisos, por ejemplo:

```http
Authorization: Bearer <token>
```

El backend valida el token antes de permitir operaciones sensibles como crear o borrar blogs.

---

## Pruebas

### Backend

Desde `server/`:

```bash
npm test
```

El proyecto incluye pruebas de API con `supertest` y `node:test`.

### Frontend

Desde `client/`:

```bash
npm test
```

También hay pruebas con React Testing Library y Vitest para componentes y flujos esenciales.

### End-to-end

En `e2e/`:

```bash
npm test
```

Estas pruebas validan flujos reales de usuario usando Playwright.

---

## Funcionalidades clave implementadas

- gestión de usuarios
- seguridad con hashes de contraseñas usando bcrypt
- token JWT para sesiones
- control de permisos para borrar blogs
- likes y actualización de datos en tiempo real
- navegación con rutas del frontend
- manejo de mensajes de éxito/error en la interfaz
- separación limpia entre backend y frontend

---

## Lo que este proyecto enseña dentro de Full Stack Open

Este repositorio refleja varios conceptos importantes del curso:

- desarrollo de APIs REST con Express
- persistencia con MongoDB y Mongoose
- manejo de autenticación y autorización
- uso de JWT para proteger recursos
- construcción de una interfaz con React
- conexión entre frontend y backend
- pruebas unitarias e integración
- despliegue básico de una aplicación full stack

---

## Créditos

Proyecto desarrollado en el contexto del curso Full Stack Open, con enfoque en la construcción de una aplicación web full stack completa.

---

## Autor

Tomas Holguin Serna - Thom4x
