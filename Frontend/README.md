# 🖥️ GameRatings – Frontend (Angular)

Este proyecto es el frontend del sistema **GameRatings**, una plataforma para descubrir, votar y comentar videojuegos. Está desarrollado con **Angular** y se conecta al backend Laravel a través de una API RESTful.

---

## 🚀 Tecnologías utilizadas

- Angular
- TypeScript
- Bootstrap / Tailwind / CSS
- API REST (Laravel + Sanctum)

---

## ⚙️ Requisitos previos

- Node.js 18+
- Angular CLI
- Conexión activa con el backend (`http://localhost:8000` por defecto)

---

## 🧪 Instalación y uso

1. Instala las dependencias del proyecto:

```
npm install
```
Inicia el servidor de desarrollo:

```
ng serve
```

Abre en tu navegador:
```
http://localhost:4200
```

🔐 Conexión con el backend
El frontend se comunica con la API Laravel (backend) ubicada por defecto en:
```
http://localhost:8000/api
```
Asegúrate de que el backend esté levantado y acepte conexiones desde el frontend.

📝 Funcionalidades previstas

- Visualización de juegos, puntuaciones y etiquetas
- Registro e inicio de sesión
- Publicación y votación de reviews y comentarios
- Participación en encuestas
- Perfil de usuario y logros
- Panel de moderación (solo moderadores)

📁 Estructura del proyecto
~~~
frontend/
├── src/
│   ├── app/
├── angular.json
├── package.json
└── README.md
~~~
👤 Autor
Desarrollado por Alejandro Verdugo Linero
Proyecto Integrado – DAW 2025