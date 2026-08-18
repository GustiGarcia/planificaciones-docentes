# Planificaciones Docentes

Sistema para automatizar la creación de planificaciones docentes en la provincia de Mendoza. Permite seleccionar contenidos del Diseño Curricular Provincial (DCP) y completar la parte específica de cada docente (estrategias de enseñanza, evaluación, ABP), exportando el resultado final.

## 📌 Motivación

Cada año, los docentes deben presentar planificaciones que combinan:
- Contenidos fijos que salen del **Diseño Curricular Provincial** (en PDF)
- Una parte específica que cada docente completa (estrategias, evaluación, actividades)

Este proyecto busca digitalizar ese proceso: cargar el contenido curricular una sola vez en una base de datos, y permitir que el docente arme su planificación seleccionando contenidos y agregando su propia parte, en vez de transcribir todo a mano cada año.

## 🚧 Estado del proyecto

**En desarrollo activo** — proyecto académico (Programación 3, Tecnicatura en Desarrollo de Software).

### Hecho hasta ahora
- [x] Setup de NestJS + TypeORM + PostgreSQL
- [x] Entities del contenido curricular: `Materia`, `Eje`, `ContenidoCurricular`
- [x] Jerarquía de relaciones: **Materia → Eje → ContenidoCurricular**
- [x] CRUD completo de `Materia` (findAll, findOne, create, update, remove)
- [x] CRUD completo de `Eje`
- [x] CRUD completo de `ContenidoCurricular`
- [x] DTOs con validación (`class-validator`) y `ValidationPipe` global
- [x] Manejo de errores con `NotFoundException` (404)

### En curso
- [ ] Entity `Docente`
- [ ] Entities `Aprendizajes Especificos` y `PlanificacionDetalle`

### Por hacer
- [ ] Carga de datos reales del DCP (Educación Física completa: 1° a 5° año)
- [ ] Entities `Escuela`, `AcuerdoInstitucional`, `AcuerdoArea`
- [ ] Endpoint para listar contenidos filtrados por eje
- [ ] Exportación de planificación a PDF
- [ ] Frontend (React + TypeScript)
- [ ] Expansión a otras materias y orientaciones
- [ ] Módulo de proyectos escolares (salidas, proyectos institucionales)
- [ ] Autenticación de docentes

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | [NestJS](https://nestjs.com/) + TypeScript |
| ORM | [TypeORM](https://typeorm.io/) |
| Base de datos | PostgreSQL 17 |
| Validación | class-validator + class-transformer |
| Testing de API | Postman |
| Frontend (a futuro) | React + TypeScript |

## 📂 Estructura del proyecto

```
src/
 ┣ entities/                        → Modelos de datos (tablas)
 ┃  ┣ materia.entity.ts
 ┃  ┣ eje.entity.ts
 ┃  ┗ contenido-curricular.entity.ts
 ┣ materias/                        → Módulo de Materias
 ┃  ┣ dto/
 ┃  ┣ materias.controller.ts
 ┃  ┣ materias.service.ts
 ┃  ┗ materias.module.ts
 ┣ ejes/                            → Módulo de Ejes
 ┃  ┣ dto/
 ┃  ┣ ejes.controller.ts
 ┃  ┣ ejes.service.ts
 ┃  ┗ ejes.module.ts
 ┣ contenidos-curriculares/         → Módulo de Contenidos Curriculares
 ┃  ┣ dto/
 ┃  ┣ contenidos-curriculares.controller.ts
 ┃  ┣ contenidos-curriculares.service.ts
 ┃  ┗ contenidos-curriculares.module.ts
 ┣ aprendizajes-especificos/         → Módulo de aprendizajes especificos
    ┣ dto/
    ┣ aprendizajes-especificos.controller.ts
    ┣ aprendizajes-especificos.module.ts
    ┗ aprendizajes-especificos.service
 ┣ app.module.ts                    → Módulo raíz, conecta todo
 ┗ main.ts                          → Punto de entrada (ValidationPipe global)
```

## 🗄️ Modelo de datos

### Implementado

```
Materia (nombre, orientacion)
  └── Eje (nombre)
        └── ContenidoCurricular (anio, saberes)
```

Relaciones: `@OneToMany` desde el lado padre, `@ManyToOne` desde el lado hijo (donde vive la FK).

### Planificado

```
Docente ──┐
          ├── Planificacion (cursoDivision, anioLectivo)
Escuela ──┘        └── PlanificacionDetalle
                         ├── ContenidoCurricular (seleccionado del DCP)
                         ├── estrategiaEnsenanza (texto del docente)
                         ├── evaluacion (texto del docente)
                         └── abp (texto del docente)
```

## 🔌 Endpoints disponibles

### Materias
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/materias` | Lista todas las materias |
| GET | `/materias/:id` | Obtiene una materia por id |
| POST | `/materias` | Crea una materia |
| PATCH | `/materias/:id` | Actualiza una materia |
| DELETE | `/materias/:id` | Elimina una materia |

### Ejes
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/ejes` | Lista todos los ejes |
| GET | `/ejes/:id` | Obtiene un eje por id |
| POST | `/ejes` | Crea un eje (requiere `materiaId`) |
| PATCH | `/ejes/:id` | Actualiza un eje |
| DELETE | `/ejes/:id` | Elimina un eje |

### Contenidos Curriculares
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/contenidos-curriculares` | Lista todos los contenidos |
| GET | `/contenidos-curriculares/:id` | Obtiene un contenido por id |
| POST | `/contenidos-curriculares` | Crea un contenido (requiere `ejeId`) |
| PATCH | `/contenidos-curriculares/:id` | Actualiza un contenido |
| DELETE | `/contenidos-curriculares/:id` | Elimina un contenido |

## 🚀 Cómo correr el proyecto localmente

### Requisitos previos
- Node.js
- PostgreSQL 17 instalado y corriendo
- Base de datos creada (ej: `planificaciones_db`)

### Pasos

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/GustiGarcia/planificaciones-docentes.git
   cd planificaciones-docentes
   ```

2. Instalá las dependencias:
   ```bash
   npm install
   ```

3. Configurá la conexión a la base de datos en `src/app.module.ts` (host, usuario, contraseña, nombre de la base).

4. Levantá el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```

5. La API queda disponible en `http://localhost:3000`

> **Nota:** el proyecto usa `synchronize: true` en TypeORM, lo que crea/actualiza las tablas automáticamente según las entities. Esto es cómodo en desarrollo pero **no debe usarse en producción**.

### Orden para cargar datos de prueba

Por la jerarquía de relaciones, hay que crear los registros en este orden:

1. `POST /materias` → guardar el `id` devuelto
2. `POST /ejes` con ese `materiaId` → guardar el `id` devuelto
3. `POST /contenidos-curriculares` con ese `ejeId`

## 🔍 Consulta útil (SQL)

Para ver todas las materias con sus ejes y contenidos relacionados:

```sql
SELECT
  m.nombre AS materia,
  m.orientacion,
  e.nombre AS eje,
  c.anio,
  c.saberes
FROM materias m
LEFT JOIN ejes e ON e."materiaId" = m.id
LEFT JOIN contenidos_curriculares c ON c."ejeId" = e.id
ORDER BY m.nombre, e.nombre, c.anio;
```

## 🌿 Flujo de trabajo (Git)

- `master` — rama estable
- `feature/nombre-de-la-funcionalidad` — una rama por funcionalidad o dominio nuevo
- Commits chicos y descriptivos
- Merge a `master` solo cuando el bloque de trabajo está probado y funcionando

Ramas del proyecto:
- `feature/materias-crud` — CRUD de Materia, Eje y ContenidoCurricular *(mergeada)*
- `feature/planificaciones` — Docente, Planificacion y PlanificacionDetalle *(en curso)*

## 👤 Autor

Gustavo García — Docente de Educación Física, estudiante de la Tecnicatura en Desarrollo de Software.