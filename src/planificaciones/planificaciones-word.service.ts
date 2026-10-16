/* ═══════════════════════════════════════════════════════════════
   PlanificacionesWordService
   Arma el documento Word (.docx) de una planificación.

   Está en un service aparte y no adentro de PlanificacionesService
   a propósito: ese se ocupa de la base de datos (buscar, crear,
   actualizar). Este se ocupa de dar formato. Son dos trabajos
   distintos y cambian por razones distintas — si mañana cambia el
   diseño del documento, se toca solo este archivo.

   La librería `docx` arma el archivo por objetos, no por plantilla.
   La jerarquía es siempre la misma:
       Document → Section → Paragraph → TextRun
   Un TextRun es un pedazo de texto con un formato (negrita, tamaño).
   Un Paragraph junta varios TextRun. Y las tablas son Table → TableRow
   → TableCell, y adentro de cada celda van Paragraphs otra vez: en
   Word no existe el "texto suelto" dentro de una celda.

   Las medidas van en DXA (twips): 1 cm ≈ 567. Es la unidad vieja de
   Word y la librería la respeta.
   ═══════════════════════════════════════════════════════════════ */

import { Injectable } from '@nestjs/common';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalMergeType,
  WidthType,
} from 'docx';
import { Planificacion } from '../entities/planificacion.entity';
import type { DocumentoPlanificacionDto } from './dto/documento-planificacion.dto';

// Los colores del proyecto, en hexa sin numeral (así lo pide docx).
// Son los mismos tokens que el front define en src/index.css
// (--azul-800 y --linea): el Word tiene que salir igual que la
// vista previa, así que si allá cambia la paleta, acá también.
const AZUL = '123A66';
const GRIS_LINEA = 'DDE3EB';

@Injectable()
export class PlanificacionesWordService {
  /** Celda de encabezado: fondo azul, texto blanco. */
  private celdaTitulo(texto: string): TableCell {
    return new TableCell({
      shading: { fill: AZUL },
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: texto.toUpperCase(),
              bold: true,
              color: 'FFFFFF',
              size: 18, // medio-puntos: 18 = 9pt
            }),
          ],
        }),
      ],
    });
  }

  /** Celda de contenido: una lista con viñetas, o un guion si está
   *  vacía. Nunca la dejamos en blanco: una celda vacía en un
   *  documento oficial se lee como un olvido, el guion se lee como
   *  una decisión. */
  private celdaLista(items: string[], negrita = false): TableCell {
    const parrafos =
      items.length === 0
        ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: '—', color: '888888' })],
            }),
          ]
        : items.map(
            (texto) =>
              new Paragraph({
                // bullet sale con viñeta de Word; nivel 0 = primer nivel
                ...(items.length > 1 || !negrita
                  ? { bullet: { level: 0 } }
                  : {}),
                children: [new TextRun({ text: texto, bold: negrita, size: 18 })],
              }),
          );

    return new TableCell({
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      children: parrafos,
    });
  }

  /** Una línea de la cabecera: "Docente: Gustavo García" */
  private dato(etiqueta: string, valor: string): Paragraph {
    return new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: `${etiqueta}: `, bold: true, size: 20 }),
        new TextRun({ text: valor || '—', size: 20 }),
      ],
    });
  }

  /**
   * Traduce una planificación de la base al formato del documento.
   *
   * Es el puente entre los dos mundos: la entity habla de relaciones
   * y objetos (detalle.metodosEvaluacion[].nombre), el documento
   * habla de textos (fila.evaluacion[]). Este método es el único
   * lugar donde esos dos vocabularios se tocan.
   *
   * Requiere que la planificación venga con sus relaciones cargadas
   * (el findOne del service las trae). Si llegara sin ellas, los
   * `?? []` hacen que salga un documento con las celdas vacías en
   * lugar de romper.
   */
  desdeEntidad(planificacion: Planificacion): DocumentoPlanificacionDto {
    return {
      cursoDivision: planificacion.cursoDivision,
      anioLectivo: planificacion.anioLectivo,
      materia: planificacion.materia?.nombre ?? '',
      docente: planificacion.user?.nombre ?? '',
      cuatrimestre: planificacion.cuatrimestre ?? null,
      filas: (planificacion.detalles ?? []).map((detalle) => ({
        eje: detalle.contenidoCurricular?.eje?.nombre ?? '',
        saberes: detalle.contenidoCurricular?.saberes ?? '',
        aprendizajes: (detalle.aprendizajes ?? []).map((a) => a.descripcion),
        estrategias: (detalle.estrategias ?? []).map((e) => e.nombre),
        actividades: (detalle.actividades ?? []).map((a) => a.nombre),
        evaluacion: (detalle.metodosEvaluacion ?? []).map((m) => m.nombre),
        abp: (detalle.temas ?? []).map((t) => t.nombre),
      })),
    };
  }

  /**
   * Convierte el documento en un .docx y lo devuelve como Buffer,
   * listo para mandar por HTTP o guardar en disco.
   */
  async generar(doc: DocumentoPlanificacionDto): Promise<Buffer> {
    const periodo =
      doc.cuatrimestre === null || doc.cuatrimestre === undefined
        ? 'Planificación anual'
        : `${doc.cuatrimestre}° cuatrimestre`;

    const filasDoc = doc.filas ?? [];

    const encabezado = new TableRow({
      tableHeader: true, // se repite si la tabla pasa de hoja
      children: [
        this.celdaTitulo('Eje'),
        this.celdaTitulo('Saberes'),
        this.celdaTitulo('Aprendizajes específicos'),
        this.celdaTitulo('Estrategias'),
        this.celdaTitulo('Actividades'),
        this.celdaTitulo('Evaluación'),
        this.celdaTitulo('ABP'),
      ],
    });

    /* La columna del eje se fusiona verticalmente mientras el eje no
       cambia, igual que en la planificación de papel: el eje se
       escribe una vez y abarca todos sus saberes.

       En Word una fusión vertical no es una celda que ocupa varias
       filas, como el rowSpan del HTML: TODAS las filas llevan su
       celda, y la primera del grupo se marca RESTART mientras las
       de abajo van CONTINUE (con el texto vacío, que Word ignora).
       Si una CONTINUE faltara, la tabla quedaría corrida. */
    const filas = filasDoc.map((fila, indice) => {
      const ejeAnterior = indice > 0 ? (filasDoc[indice - 1].eje ?? '') : null;
      const abreGrupo = (fila.eje ?? '') !== ejeAnterior;

      return new TableRow({
        children: [
          new TableCell({
            verticalMerge: abreGrupo
              ? VerticalMergeType.RESTART
              : VerticalMergeType.CONTINUE,
            verticalAlign: 'center' as never,
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: abreGrupo ? fila.eje || '—' : '',
                    bold: true,
                    size: 18,
                    color: AZUL,
                  }),
                ],
              }),
            ],
          }),
          this.celdaLista([fila.saberes || '—'], true),
          this.celdaLista(fila.aprendizajes ?? []),
          this.celdaLista(fila.estrategias ?? []),
          this.celdaLista(fila.actividades ?? []),
          this.celdaLista(fila.evaluacion ?? []),
          this.celdaLista(fila.abp ?? []),
        ],
      });
    });

    const tabla = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: GRIS_LINEA },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: GRIS_LINEA },
        left: { style: BorderStyle.SINGLE, size: 1, color: GRIS_LINEA },
        right: { style: BorderStyle.SINGLE, size: 1, color: GRIS_LINEA },
        insideHorizontal: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: GRIS_LINEA,
        },
        insideVertical: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: GRIS_LINEA,
        },
      },
      rows: [encabezado, ...filas],
    });

    const documento = new Document({
      sections: [
        {
          properties: {
            page: {
              // Apaisado: la tabla tiene siete columnas y no entra
              // cómoda en vertical.
              size: { orientation: 'landscape' as never },
              margin: { top: 720, bottom: 720, left: 720, right: 720 },
            },
          },
          children: [
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: 'DIRECCIÓN GENERAL DE ESCUELAS · PROVINCIA DE MENDOZA',
                  size: 16,
                  color: '888888',
                }),
              ],
            }),

            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: `Planificación ${doc.anioLectivo}`,
                  bold: true,
                  size: 32,
                  color: AZUL,
                }),
              ],
            }),

            this.dato('Espacio curricular', doc.materia),
            this.dato('Curso', doc.cursoDivision),
            this.dato('Docente', doc.docente),
            this.dato('Período', periodo),

            new Paragraph({ text: '', spacing: { after: 200 } }),

            tabla,

            new Paragraph({ text: '', spacing: { after: 600 } }),

            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '______________________________',
                  size: 20,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Firma del docente',
                  size: 16,
                  color: '888888',
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Packer convierte el objeto Document en el archivo real.
    // toBuffer sirve para mandarlo por HTTP sin tocar el disco.
    return Packer.toBuffer(documento);
  }

  /** Nombre sugerido del archivo: "planificacion-3-2da-2026.docx" */
  nombreArchivo(doc: DocumentoPlanificacionDto): string {
    const curso = (doc.cursoDivision || 'sin-curso')
      .toLowerCase()
      .normalize('NFD') // separa las tildes de las letras
      .replace(/[̀-ͯ]/g, '') // y las borra
      .replace(/[^a-z0-9]+/g, '-') // todo lo raro pasa a guion
      .replace(/^-|-$/g, '');

    return `planificacion-${curso}-${doc.anioLectivo}.docx`;
  }
}
