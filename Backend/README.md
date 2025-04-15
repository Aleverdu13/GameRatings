# 🎮 GameRatings – Backend

Este proyecto es el backend de **GameRatings**, una plataforma para que los usuarios descubran, valoren y comenten videojuegos. Está desarrollado con **Laravel 12**, **MySQL** y **Docker**, y ofrece una API RESTful segura con autenticación mediante **Sanctum**.

---

## 🚀 Tecnologías

- PHP 8.2 / Laravel 12
- MySQL 8
- Laravel Sanctum (autenticación por token)
- Docker + Docker Compose
- Thunder Client o Postman para pruebas

---

## 🧰 Requisitos previos

- Docker y Docker Compose instalados
- Git instalado (opcional, para clonar)

---

## ⚙️ Instalación rápida con Docker

1. Clona el repositorio:

```bash
git clone https://github.com/Aleverdu13/GameRatings.git
cd gameratings/backend
```

2. Levanta los contenedores:

```bash
docker-compose up -d --build
```

3. Ejecuta migraciones y seeders:

```bash
docker exec -it backend_app php artisan migrate --seed
```

> 📌 Si necesitas limpiar todo y empezar desde cero:  
> `php artisan migrate:fresh --seed`

4. Accede en tu navegador a:

```
http://localhost:8000
```

---

## 🔐 Autenticación

El sistema usa **Laravel Sanctum** para autenticar mediante tokens.

### Rutas principales:

| Método | Ruta                 | Descripción                        |
|--------|----------------------|------------------------------------|
| POST   | `/api/register`      | Registro de usuario                |
| POST   | `/api/login`         | Login (devuelve token)             |
| GET    | `/api/profile`       | Perfil del usuario autenticado     |
| POST   | `/api/logout`        | Cerrar sesión                      |

> 📌 Agrega este header en rutas protegidas:  
> `Authorization: Bearer 2|y280G8SJNk7PEYov8zzkf4gxQUSf9ICwy2z123Wu6853739d`

---

## 📝 Funcionalidades implementadas

### 🎮 Reviews
- Crear, listar y votar
- Comentarios con sistema de votos
- Recuento de votos positivos/negativos

### 🗳️ Encuestas
- Crear encuestas (solo admin)
- Votar una vez por usuario
- Ver resultados en tiempo real

### 🏆 Logros automáticos
- Se otorgan al hacer acciones como comentar por primera vez

### 👤 Roles de usuario
- `user`, `moderator`, `admin`
- Panel de moderación en desarrollo

---

## 🧪 Pruebas con Thunder Client (o Postman)

### Registro de usuario

```json
POST /api/register

{
    "name": "Alejandro",
    "email": "alejandro@example.com",
    "password": "password",
    "password_confirmation": "password"
}
```

### Crear review (protegido)

```json
POST /api/games/1/reviews

Headers:
Authorization: Bearer 2|y280G8SJNk7PEYov8zzkf4gxQUSf9ICwy2z123Wu6853739d

{
    "title": "Recommended",
    "content": "Juego increíble."
}
```

---

## 📂 Estructura del proyecto

```
backend/
├── app/
├── routes/
├── public/
├── docker-compose.yml
├── Dockerfile
├── .env
└── README.md
```

---

## 👤 Autor

Desarrollado por **Alejandro Verdugo Linero**  
Proyecto Integrado – DAW 2025

---
