# Planificaciones Docentes

Aplicación para automatizar la creación de planificaciones docentes anuales a partir del **Diseño Curricular Provincial (DCP)** de Mendoza.

El docente selecciona los contenidos curriculares oficiales desde una base de datos, agrega sus propios aportes (estrategias de enseñanza, actividades, métodos de evaluación, temas de ABP) y exporta el resultado como PDF.

---

## Stack

| Capa | Tecnología |
|---|---|
| Backend | NestJS + TypeScript |
| ORM | TypeORM |
| Base de datos | PostgreSQL 17 |
| Validación | class-validator + class-transformer |
| Testing de API | Postman / Thunder Client |
| Frontend | React + TypeScript *(planeado)* |

---

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos en PostgreSQL
#    CREATE DATABASE planificaciones_db;

# 3. Levantar en modo desarrollo
npm run start:dev
```

La app corre en `http://localhost:3000`.

Con `synchronize: true` activo, TypeORM crea y actualiza las tablas automáticamente al arrancar. **No usar en producción.**

> ⚠️ Las credenciales de la base están hardcodeadas en `app.module.ts`. Pendiente moverlas a variables de entorno con `@nestjs/config`.

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
  └── Planificacion               (cursoDivision, anioLectivo, fechaCreacion)
        └── PlanificacionDetalle  ← una fila de la tabla del PDF
              ├── ContenidoCurricular      [ManyToOne]
              ├── AprendizajeEspecifico[]  [ManyToMany]
              ├── EstrategiaEnsenanza[]    [ManyToMany]
              ├── Actividad[]              [ManyToMany]
              ├── MetodoEvaluacion[]       [ManyToMany]
              └── Tema[]                   [ManyToMany]
```

### Catálogos del docente

`EstrategiaEnsenanza`, `Actividad`, `MetodoEvaluacion` y `Tema` comparten la misma estructura:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | number | PK |
| `nombre` | text | |
| `esPredefinida` | boolean | `true` = viene con el sistema |
| `user` | User (nullable) | dueño, si es una opción propia del docente |

Esto permite que el docente reutilice sus propias opciones año a año, en lugar de reescribirlas como texto libre.

### Decisiones de diseño

- **Los detalles guardan referencias (ids), no copias de texto.** Si se corrige un saber del DCP, el cambio se refleja en todas las planificaciones automáticamente.
- **Sin `onDelete: 'CASCADE'`.** Se prefiere que Postgres frene el borrado si hay registros relacionados, como protección del contenido curricular oficial.
- Las relaciones hacia los catálogos son **unidireccionales**: el catálogo no necesita saber quién lo usa.

---

## Endpoints disponibles

CRUD completo (`GET` all, `GET` by id, `POST`, `PATCH`, `DELETE`) en:

- `/materias`
- `/ejes`
- `/contenidos-curriculares`
- `/aprendizajes-especificos`

Todos con DTOs validados y `NotFoundException` (404) cuando el id no existe.

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

> Las comillas dobles son obligatorias en las columnas camelCase que genera TypeORM.

---

## Estado del proyecto

### Hecho

- [x] Setup NestJS + TypeORM + PostgreSQL
- [x] Entities del catálogo DCP: `Materia`, `Eje`, `ContenidoCurricular`, `AprendizajeEspecifico`
- [x] CRUD completo de las 4 entities del catálogo, con DTOs y manejo de errores
- [x] Entity `User`
- [x] Entities `Planificacion` y `PlanificacionDetalle`
- [x] Catálogos del docente: `EstrategiaEnsenanza`, `Actividad`, `MetodoEvaluacion`, `Tema`
- [x] 5 tablas intermedias generadas por `@ManyToMany` + `@JoinTable`
- [x] Datos de prueba cargados y verificados

### Pendiente

- [ ] CRUD de `Planificacion`, `PlanificacionDetalle` y los 4 catálogos
- [ ] Endpoint para filtrar contenidos por eje
- [ ] Carga de los datos reales del DCP (1° a 5° año)
- [ ] Autenticación
- [ ] Exportación a PDF
- [ ] Frontend React + TypeScript (modelo de UI: *live-build canvas*)
- [ ] Módulo de proyectos escolares (salidas, proyectos institucionales)
- [ ] Entities `Escuela`, `AcuerdoInstitucional`, `AcuerdoArea`

---

## Patrones aplicados

- **Repository Pattern** — acceso a datos aislado vía repositorios de TypeORM
- **Dependency Injection** — provisto por el contenedor de NestJS
- **DTO** — separación entre el dato que entra por HTTP y la entity
- **Data Mapper** — la entity es solo datos; la persistencia la maneja el repositorio
- **Arquitectura por capas** — Controller → Service → Repository
- **Module Pattern** — organización por dominio, no por tipo técnico

---

## Flujo de trabajo con Git

```bash
git pull                              # al empezar (sincronizar entre máquinas)
git checkout -b feature/nombre        # una rama por funcionalidad
# ...trabajar, commits chicos y descriptivos...
git push -u origin feature/nombre     # el -u es necesario la primera vez
```

Rama estable: `master`. Al terminar una funcionalidad, se mergea a `master`.

> Después de cada `git clone`, correr `npm install` — `node_modules` no se versiona.