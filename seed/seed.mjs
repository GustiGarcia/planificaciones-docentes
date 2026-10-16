/* ═══════════════════════════════════════════════════════════════
   SEED — carga el DCP en la base

   Qué hace: lee los archivos de seed/data/ (uno por materia) y los
   carga contra la API, en el orden que exigen las relaciones:

       materia → ejes → contenidos → aprendizajes

   Por qué contra la API y no directo a Postgres con TypeORM:

   · Hace exactamente lo mismo que harías vos en Postman, así que
     si algo falla, falla igual que te fallaría a mano. El error que
     ves es el error real de tu backend, con su mensaje de
     validación incluido.
   · No duplica la lógica. Los services ya saben cómo relacionar un
     contenido con su eje; escribir INSERTs a mano sería reescribir
     eso y arriesgarse a que queden distintos.
   · No necesita credenciales de base ni levantar un contexto de
     Nest: alcanza con que el backend esté corriendo.

   El precio es que son muchas requests (unas 160 para una materia).
   Para un seed que corrés de vez en cuando, no importa: tarda unos
   segundos.

   Uso:
       npm run seed                  → carga todo lo que haya en data/
       npm run seed educacion-fisica → carga solo esa materia

   Requiere el backend levantado (npm run start:dev).
   ═══════════════════════════════════════════════════════════════ */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL ?? 'http://localhost:3000';

/* ───────────── Utilidades ───────────── */

/** POST con manejo de error legible. Si el backend rechaza algo,
 *  queremos ver QUÉ rechazó, no un "Error 400" pelado. */
async function post(ruta, cuerpo) {
  let res;
  try {
    res = await fetch(`${API}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw new Error(
      `No se pudo conectar con ${API}. ¿Está levantado el backend?`,
    );
  }

  const texto = await res.text();
  const datos = texto ? JSON.parse(texto) : undefined;

  if (!res.ok) {
    const msg = Array.isArray(datos?.message)
      ? datos.message.join(', ')
      : (datos?.message ?? `Error ${res.status}`);
    throw new Error(`POST ${ruta} → ${res.status}: ${msg}`);
  }

  return datos;
}

async function get(ruta) {
  let res;
  try {
    res = await fetch(`${API}${ruta}`);
  } catch {
    throw new Error(
      `No se pudo conectar con ${API}. ¿Está levantado el backend?`,
    );
  }
  if (!res.ok) throw new Error(`GET ${ruta} → ${res.status}`);
  return res.json();
}

const leerJson = async (ruta) => JSON.parse(await readFile(ruta, 'utf8'));

/* ───────────── Carga de una materia ───────────── */

/* Normaliza para comparar nombres: sin mayúsculas, sin tildes y sin
   espacios de más. Así "Educación Física " y "educacion fisica" son
   el mismo registro y no se duplican. */
function clave(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}

/* El seed es INCREMENTAL, no "todo o nada":

     · si la materia ya existe, la reutiliza en vez de saltearla;
     · si un eje ya existe en esa materia, lo reutiliza;
     · si un saber ya está cargado (mismo año y mismo texto), lo saltea.

   Esto importa de verdad: cuando sumamos el Ciclo Orientado a una
   materia que ya tenía el Ciclo Básico cargado, saltear la materia
   entera habría dejado afuera los años nuevos. Así, correrlo de
   nuevo agrega sólo lo que falta. */
async function cargarMateria(archivo) {
  const dcp = await leerJson(archivo);

  const materias = await get('/materias');
  let materia = materias.find(
    (m) => clave(m.nombre) === clave(dcp.materia.nombre),
  );

  if (materia) {
    console.log(`  · Materia "${materia.nombre}" ya existe (id ${materia.id}), completo lo que falte.`);
  } else {
    materia = await post('/materias', dcp.materia);
    console.log(`  ✓ Materia "${materia.nombre}" (id ${materia.id})`);
  }

  /* Los ejes ya cargados de ESTA materia. El backend devuelve todos
     los ejes con su materia, así que filtramos acá. */
  const todosLosEjes = await get('/ejes');
  const ejesDeLaMateria = todosLosEjes.filter((e) => e.materia?.id === materia.id);

  let nEjes = 0, nContenidos = 0, nAprendizajes = 0, saltados = 0;

  for (const ejeDef of dcp.ejes) {
    let eje = ejesDeLaMateria.find((e) => clave(e.nombre) === clave(ejeDef.nombre));

    if (!eje) {
      eje = await post('/ejes', { nombre: ejeDef.nombre, materiaId: materia.id });
      nEjes++;
    }

    /* Los saberes ya cargados en este eje, para no repetirlos.
       La comparación es por año + texto: el mismo saber en 1° y en
       2° son dos registros distintos y los dos tienen que estar. */
    const yaCargados = new Set(
      (await get(`/contenidos-curriculares?ejeId=${eje.id}`)).map(
        (c) => `${c.anio}|${clave(c.saberes)}`,
      ),
    );

    for (const contDef of ejeDef.contenidos) {
      if (yaCargados.has(`${contDef.anio}|${clave(contDef.saberes)}`)) {
        saltados++;
        continue;
      }

      const contenido = await post('/contenidos-curriculares', {
        anio: contDef.anio,
        saberes: contDef.saberes,
        ejeId: eje.id,
      });
      nContenidos++;

      for (const descripcion of contDef.aprendizajes ?? []) {
        await post('/aprendizajes-especificos', {
          descripcion,
          contenidoId: contenido.id,
        });
        nAprendizajes++;
      }
    }

    console.log(`    · Eje "${eje.nombre}" listo`);
  }

  if (saltados > 0) {
    console.log(`    (${saltados} saberes ya estaban cargados)`);
  }

  return { ejes: nEjes, contenidos: nContenidos, aprendizajes: nAprendizajes };
}

/* ───────────── Carga de catálogos ───────────── */

async function cargarCatalogos() {
  const cat = await leerJson(join(AQUI, 'catalogos.json'));

  const rutas = {
    estrategias: '/estrategias-ensenanza',
    actividades: '/actividades',
    metodosEvaluacion: '/metodos-evaluacion',
    temas: '/temas',
  };

  let total = 0;

  for (const [campo, ruta] of Object.entries(rutas)) {
    const existentes = await get(ruta);
    const nombres = new Set(existentes.map((i) => clave(i.nombre)));

    for (const nombre of cat[campo] ?? []) {
      if (nombres.has(clave(nombre))) continue;
      await post(ruta, { nombre, esPredefinida: true });
      total++;
    }
  }

  console.log(`  ✓ ${total} items de catálogo cargados`);
}

/* ───────────── Main ───────────── */

async function main() {
  /* Argumento opcional: el nombre del archivo (sin .json) para
     cargar una sola materia. */
  const filtro = process.argv[2];

  console.log(`\nSeed del DCP → ${API}\n`);

  const dirDatos = join(AQUI, 'data');
  const archivos = (await readdir(dirDatos))
    .filter((f) => f.endsWith('.json'))
    .filter((f) => !filtro || f === `${filtro}.json`);

  if (archivos.length === 0) {
    console.log(
      filtro
        ? `No encontré seed/data/${filtro}.json`
        : 'No hay archivos en seed/data/',
    );
    return;
  }

  console.log('Catálogos del docente:');
  await cargarCatalogos();

  const total = { ejes: 0, contenidos: 0, aprendizajes: 0 };

  for (const archivo of archivos) {
    console.log(`\n${archivo}:`);
    const r = await cargarMateria(join(dirDatos, archivo));
    total.ejes += r.ejes;
    total.contenidos += r.contenidos;
    total.aprendizajes += r.aprendizajes;
  }

  console.log(
    `\nListo: ${total.ejes} ejes, ${total.contenidos} saberes, ${total.aprendizajes} aprendizajes.\n`,
  );
}

main().catch((e) => {
  console.error(`\n✗ ${e.message}\n`);
  /* Código 1 para que, si algún día lo corrés en un pipeline, se
     note que falló. */
  process.exit(1);
});
