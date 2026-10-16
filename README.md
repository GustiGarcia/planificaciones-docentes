# Carpeta Docente — Backend

API para armar planificaciones docentes a partir del **Diseño Curricular
Provincial (DCP)** de Mendoza.

Sirve el catálogo oficial del DCP (materias, ejes, saberes, aprendizajes), los
catálogos propios de cada docente (estrategias, actividades, evaluación, temas
de ABP), guarda las planificaciones armadas y las exporta a Word.

El cliente es un proyecto aparte:
**[planificaciones-docentes-front](https://github.com/GustiGarcia/planificaciones-docentes-front)**
(React + Vite).

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 + TypeScript |
| ORM | TypeORM |
| Base de datos | PostgreSQL 17 |
| Validación | class-validator + class-transformer |
| Documentación | Swagger (`@nestjs/swagger`) |
| Exportación | `docx` |

---

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base en PostgreSQL
#    CREATE DATABASE planificaciones_db;

# 3. Levantar en modo desarrollo
npm run start:dev

# 4. Cargar el DCP (con el backend ya corriendo, en otra terminal)
npm run seed
```

Queda en `http://localhost:3000`, y la documentación navegable en
`http://localhost:3000/api`.

Con `synchronize: true`, TypeORM crea y actualiza las tablas solo al arrancar.
**No usar en producción:** una columna renombrada puede llevarse los datos
puestos.

> ⚠️ **Dos cosas hardcodeadas**, pendientes de pasar a variables de entorno con
> `@nestjs/config`:
>
> - Las credenciales de la base, en `app.module.ts`
>   (`localhost:5432`, `postgres` / `admin`, `planificaciones_db`).
> - El origen de CORS, en `main.ts`: `http://localhost:5173`.
>
> Lo segundo muerde en el día a día. Si el 5173 está ocupado, Vite levanta el
> front en el 5174 y **todas las requests fallan por CORS** aunque el backend
> esté perfecto. El síntoma engaña: el front dice que no se puede conectar.

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Desarrollo, con recarga al guardar |
| `npm run start:prod` | Corre lo compilado en `dist/` |
| `npm run build` | Compila |
| `npm run lint` | ESLint, con `--fix` |
| `npm run test` | Tests unitarios (Jest) |
| `npm run seed` | Carga el DCP y los catálogos |

---

## El seed

`seed/` trae el DCP ya transcripto: **20 materias** en `seed/data/` (una por
archivo) más `catalogos.json` con un punto de partida de estrategias,
actividades, métodos de evaluación y temas.

```bash
npm run seed                  # todo
npm run seed educacion-fisica # solo esa materia
```

Carga **contra la API, no contra Postgres**. Es más lento (unas 160 requests
por materia) pero tiene tres ventajas: hace exactamente lo que harías a mano en
Postman, no duplica la lógica de relaciones que ya está en los services, y
cuando algo falla el error que ves es el de tu propio backend con su mensaje de
validación. Por eso **necesita el backend levantado**.

Apunta a `http://localhost:3000`, o a `API_URL` si la definís.

Lo de `catalogos.json` no sale del DCP: el diseño curricular define saberes y
aprendizajes, no estrategias ni actividades — esa es la parte que aporta cada
docente. Es solo para que la app no arranque vacía.

---

## Modelo de datos

Son **dos árboles independientes** que se cruzan en `PlanificacionDetalle`.

### Árbol 1 — Catálogo del DCP (fijo, oficial)

Es de donde el docente *elige*.

```
Materia
  └── Eje
        └── ContenidoCurricular   (anio, saberes)
              └── AprendizajeEspecifico
```

### Árbol 2 — Planificación (lo que se genera)

```
User
  └── Planificacion               (cursoDivision, anioLectivo, cuatrimestre, fechaCreacion)
        └── PlanificacionDetalle  ← una fila de la tabla del documento
              ├── ContenidoCurricular      [ManyToOne]
              ├── AprendizajeEspecifico[]  [ManyToMany]
              ├── EstrategiaEnsenanza[]    [ManyToMany]
              ├── Actividad[]              [ManyToMany]
              ├── MetodoEvaluacion[]       [ManyToMany]
              └── Tema[]                   [ManyToMany]
```

`cuatrimestre` en `null` significa planificación anual.

### Catálogos del docente

`EstrategiaEnsenanza`, `Actividad`, `MetodoEvaluacion` y `Tema` comparten la
misma estructura:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | number | PK |
| `nombre` | text | |
| `esPredefinida` | boolean | `true` = viene con el sistema |
| `user` | User (nullable) | dueño, si es una opción propia del docente |

Esto permite que el docente reutilice sus propias opciones año a año, en lugar
de reescribirlas como texto libre.

### Decisiones de diseño

- **Los detalles guardan referencias (ids), no copias de texto.** Si se corrige
  un saber del DCP, el cambio se refleja en todas las planificaciones
  automáticamente.
- **Sin `onDelete: 'CASCADE'`.** Se prefiere que Postgres frene el borrado si
  hay registros relacionados, como protección del contenido curricular oficial.
- Las relaciones hacia los catálogos son **unidireccionales**: el catálogo no
  necesita saber quién lo usa.

---

## Endpoints

CRUD completo (`GET` all, `GET` by id, `POST`, `PATCH`, `DELETE`) en:

| Grupo | Rutas |
|---|---|
| DCP | `/materias`, `/ejes`, `/contenidos-curriculares`, `/aprendizajes-especificos` |
| Catálogos del docente | `/estrategias-ensenanza`, `/actividades`, `/metodos-evaluacion`, `/temas` |
| Planificación | `/planificaciones`, `/planificacion-detalles` |
| Usuarios | `/users` |

Todos con DTOs validados y `NotFoundException` (404) cuando el id no existe.

### Filtros

`GET /contenidos-curriculares` acepta dos query params, combinables:

```
?ejeId=1          los saberes de ese eje
?anio=3           los de ese año
?ejeId=1&anio=3   los de esa combinación   ← el que usa el front
```

Filtrar acá y no en el cliente es la diferencia entre mandar 8 saberes y
mandar 40.

### Exportación a Word

Dos caminos, para dos momentos distintos:

| Endpoint | Cuándo |
|---|---|
| `GET /planificaciones/:id/word` | La planificación ya está guardada: el documento sale de la base |
| `POST /planificaciones/word` | Todavía no se guardó: el front manda los textos y el backend solo les da formato |

El segundo recibe un `DocumentoPlanificacionDto`, el único payload del proyecto
que lleva **textos en vez de ids**. Es a propósito: el front ya tiene todo
resuelto en pantalla, así que pedirle ids obligaría al backend a ir a buscar
siete tipos de entidad para rearmar algo que ya existía. Con esta forma,
`PlanificacionesWordService` no sabe nada de TypeORM — recibe textos y da
formato.

El documento sale apaisado, con la tabla
**eje · saberes · aprendizajes · estrategias · actividades · evaluación · ABP**,
y el eje fusionado verticalmente sobre todos sus saberes, como en la
planificación de papel.

> Los colores del Word (`AZUL`, `GRIS_LINEA` en `planificaciones-word.service.ts`)
> son los mismos tokens que el front define en `src/index.css`. Si allá cambia la
> paleta, acá también: el archivo tiene que salir igual que la vista previa.

---

## Verificar los datos cargados

```sql
SELECT m.nombre AS materia, e.nombre AS eje, c.anio, c.saberes,
       a.descripcion AS aprendizaje
FROM materias m
LEFT JOIN ejes e ON e."materiaId" = m.id
LEFT JOIN contenidos_curriculares c ON c."ejeId" = e.id
LEFT JOIN aprendizajes_especificos a ON a."contenidoCurricularId" = c.id
ORDER BY e.nombre, c.id, a.id;
```

> Las comillas dobles son obligatorias en las columnas camelCase que genera
> TypeORM.

---

## Limitaciones conocidas

**Guardar una planificación no es atómico.** No hay un endpoint que reciba la
planificación entera: el front crea la cabecera y después un
`POST /planificacion-detalles` por fila. Si falla la fila 3, la planificación y
las dos primeras filas ya quedaron guardadas. Resolverlo acá —un endpoint que
reciba todo junto, dentro de una transacción— es lo que haría que el front
pudiera dejar de encadenar N+1 requests.

**Borrar un registro con dependientes devuelve 500.** Es la contracara de no
usar `CASCADE`: Postgres frena el borrado, que es lo que se quiere, pero la
violación de clave foránea sube sin traducir en lugar de convertirse en un 409
con un mensaje que explique qué lo está reteniendo.

**No hay autenticación.** Cualquiera puede leer y escribir todo. Mientras tanto
el front pide el nombre del docente a mano y, al guardar, busca o crea un `User`
con ese nombre.

**Sin configuración por entorno.** Credenciales de base y origen de CORS están
en el código (ver arriba).

---

## Patrones aplicados

- **Repository Pattern** — acceso a datos aislado vía repositorios de TypeORM
- **Dependency Injection** — provisto por el contenedor de NestJS
- **DTO** — separación entre el dato que entra por HTTP y la entity
- **Data Mapper** — la entity es solo datos; la persistencia la maneja el repositorio
- **Arquitectura por capas** — Controller → Service → Repository
- **Module Pattern** — organización por dominio, no por tipo técnico

---

## Pendiente

- [ ] Endpoint transaccional para guardar la planificación completa
- [ ] Mapear los errores de clave foránea a 409
- [ ] Configuración por variables de entorno (`@nestjs/config`)
- [ ] Autenticación
- [ ] Exportación a PDF desde el backend (hoy el PDF sale del `Ctrl+P` del navegador)
- [ ] Módulo de proyectos escolares (salidas, proyectos institucionales)
- [ ] Entities `Escuela`, `AcuerdoInstitucional`, `AcuerdoArea`

---

## Flujo de trabajo con Git

```bash
git pull                              # al empezar (sincronizar entre máquinas)
git checkout -b feature/nombre        # una rama por funcionalidad
# ...trabajar, commits chicos y descriptivos...
git push -u origin feature/nombre     # el -u es necesario la primera vez
```

Rama estable: `master`. Al terminar una funcionalidad, se mergea a `master`.

> Después de cada `git clone`, correr `npm install` — `node_modules` no se
> versiona.
