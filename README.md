# Multi Sport Tournaments — API

API de la plataforma multideporte. Expone torneos, usuarios e inscripciones para el frontend de Next.js.

- API: https://multi-sport-tournaments-api.onrender.com
- Sitio: https://multi-sport-tournaments-web.vercel.app
- Repositorio del frontend: https://github.com/JarrisonLopez/multi-sport-tournaments-web

## Tecnologías

Node.js 20, Express 5, TypeScript, Prisma 7, PostgreSQL, JWT y bcrypt.

## Cómo correrlo en local

Requiere Node.js 20.19 o superior y PostgreSQL.

```bash
npm install
copy .env.example .env
npm run prisma:deploy
npm run prisma:seed
npm run dev
```

El ejemplo de entorno usa el puerto 3000. En esta máquina de desarrollo la API escucha en el puerto 3099.

## Variables de entorno

Definidas en `.env`, que no se versiona. La plantilla está en `.env.example`.

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión a PostgreSQL. |
| `JWT_SECRET` | Secreto para firmar los tokens. Solo vive en el entorno. |
| `JWT_EXPIRES_IN` | Caducidad del JWT. |
| `PORT` | Puerto HTTP. |
| `FRONTEND_URL` | Origen permitido por CORS. En producción es la URL de Vercel. |
| `SEED_ADMIN_NOMBRE`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | Cuenta admin del seed. |
| `SEED_USER_NOMBRE`, `SEED_USER_EMAIL`, `SEED_USER_PASSWORD` | Cuenta user del seed. |

## Arquitectura

Cuatro capas:

- `src/domain`: entidades y validación de entradas.
- `src/application`: casos de uso y puertos. No conoce Express ni Prisma.
- `src/infrastructure`: Prisma, bcrypt y JWT.
- `src/interface/http`: rutas, controladores, autenticación y manejo de errores.

El catálogo es `/api/torneos`. La interacción es `/api/inscripciones`. La autenticación es `/api/auth/register` y `/api/auth/login`.

`GET /api/torneos` es público y responde `{ pagination, data }`. `POST`, `PUT` y `DELETE` exigen token de rol `ADMIN`. Crear una inscripción exige sesión; el autor sale del token, no del cuerpo.

## Flujo de login

1. `POST /api/auth/login` recibe correo y contraseña.
2. El caso de uso valida el cuerpo. Si falta algo, responde 400.
3. Busca el usuario y compara la contraseña con bcrypt. Si no hay usuario o la contraseña no coincide, responde 401 con «Credenciales inválidas.» sin decir cuál de los dos falló.
4. Si coinciden, firma un JWT con `id` y `role`, y una caducidad tomada de `JWT_EXPIRES_IN`. La contraseña no sale en la respuesta.
5. El frontend guarda ese token y lo envía como `Authorization: Bearer <token>`.
6. `authenticate` verifica la firma y la caducidad. `requireAdmin` deja pasar solo el rol `ADMIN`.

## 401 y 403

- **401** «Token inválido o expirado.»: no hay token, el formato no es Bearer o la firma no sirve. Ejemplo: `DELETE /api/torneos/t-copa-metro` sin token.
- **401** «Credenciales inválidas.»: login rechazado.
- **403** «No tienes permiso para realizar esta acción.»: el token es válido y el rol es `USER`. Ejemplo: ese mismo `DELETE` con el token de `usuario.mst@example.com`.

Otros códigos usados: 400 si el cuerpo, el parámetro o la consulta no son válidos; 404 si el torneo no existe; 409 si el identificador ya existe, si la persona ya está inscrita o si se intenta borrar un torneo con inscripciones.

## Datos y seed

PostgreSQL guarda usuarios, torneos e inscripciones. El seed crea los cuatro torneos históricos y doce de demostración. Si un identificador o un correo ya existe, no lo modifica.

## Cuentas de prueba

Solo para revisar la entrega. No son credenciales personales ni el secreto de producción.

| Rol | Correo | Contraseña |
| --- | --- | --- |
| ADMIN | `admin.mst@example.com` | `CONTRASENA_ADMIN_SEGURA` |
| USER | `usuario.mst@example.com` | `CONTRASENA_USER_SEGURA` |

## Uso de IA

Usé el asistente de Cursor para organizar las capas, el middleware de roles y el seed idempotente. Revisé que el `userId` de una inscripción salga del token y que un `USER` reciba 403 al escribir torneos.

## Evidencia de Network

La captura del encabezado `Authorization` queda pendiente de adjuntar. No hay una imagen sustituta en el repositorio.
