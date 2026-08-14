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
- [x] Setup inicial de NestJS + TypeORM + PostgreSQL
- [x] Entities: `Materia`, `ContenidoCurricular` (con relación uno a muchos)
- [x] Primer endpoint funcional: `GET /materias`
- [x] Estructura de módulo por dominio (`materias/`)

### Por hacer
- [ ] CRUD completo de Materias (crear, obtener por id, actualizar, eliminar)
- [ ] Entity y endpoints de `ContenidoCurricular`
- [ ] Carga de datos reales del DCP (Educación Física, más materias)
- [ ] Entities de `Planificacion` y `PlanificacionDetalle` (lo que arma el docente)
- [ ] Entities de `Escuela`, `Docente`, `AcuerdoInstitucional`, `AcuerdoArea`
- [ ] Exportación de planificación a PDF
- [ ] Frontend (React + TypeScript)
- [ ] Expansión a otras materias y modalidades/orientaciones
- [ ] Módulo de proyectos escolares (salidas, proyectos institucionales)

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | [NestJS](https://nestjs.com/) + TypeScript |
| ORM | [TypeORM](https://typeorm.io/) |
| Base de datos | PostgreSQL |
| Frontend (a futuro) | React + TypeScript |

## 📂 Estructura del proyecto

```
src/
 ┣ entities/              → Modelos de datos (tablas) compartidos
 ┃  ┣ materia.entity.ts
 ┃  ┗ contenido-curricular.entity.ts
 ┣ materias/               → Módulo de Materias (por dominio)
 ┃  ┣ materias.controller.ts
 ┃  ┣ materias.service.ts
 ┃  ┗ materias.module.ts
 ┣ app.module.ts           → Módulo raíz, conecta todo
 ┗ main.ts                 → Punto de entrada de la aplicación
```

## 🗄️ Modelo de datos (resumen)

```
Materia (nombre, orientación)
  └── ContenidoCurricular (año, saberes, aprendizajes específicos)
        [relación: una Materia tiene muchos ContenidoCurricular]
```

Próximamente se suman: `Planificacion`, `PlanificacionDetalle`, `Escuela`, `Docente`, `AcuerdoInstitucional`, `AcuerdoArea`.

## 🚀 Cómo correr el proyecto localmente

### Requisitos previos
- Node.js instalado
- PostgreSQL instalado y corriendo
- Una base de datos creada (ej: `planificaciones_db`)

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

### Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/materias` | Lista todas las materias |

## 🌿 Flujo de trabajo (Git)

- `master` — rama estable
- `feature/nombre-de-la-funcionalidad` — una rama por funcionalidad nueva
- Commits chicos y descriptivos
- Merge a `master` solo cuando la funcionalidad está probada y funcionando

## 👤 Autor

Gustavo García — Docente de Educación Física, estudiante de la Tecnicatura en Desarrollo de Software.