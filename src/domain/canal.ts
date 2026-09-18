/**
 * Canal de recepción de denuncias de acoso sexual y acoso laboral.
 *
 * Fundamento:
 * · Ley 2365 de 2024 — prevención, protección y atención del acoso sexual en
 *   el ámbito laboral. Obliga al empleador a adoptar un protocolo, garantizar
 *   la confidencialidad, adoptar medidas de protección inmediatas y evitar la
 *   revictimización. Cubre a trabajadores, contratistas, aprendices,
 *   practicantes y los entornos digitales de trabajo.
 * · Ley 1010 de 2006 — acoso laboral y Comité de Convivencia Laboral.
 * · Resolución MinTrabajo 2764 de 2022 — protocolo de prevención y atención.
 * · Ley 1581 de 2012 — los datos de una denuncia son datos sensibles: exigen
 *   autorización expresa y medidas de seguridad reforzadas.
 * · Código Penal, art. 210A — el acoso sexual es delito. La vía interna no
 *   sustituye ni impide la denuncia penal.
 *
 * Los términos de la ruta son los del protocolo tipo y se declaran como tales:
 * la ley exige inmediatez en la protección, pero deja a cada protocolo la
 * fijación de los plazos internos.
 */
import type { FechaISO } from '../lib/fechas';

export type TipoConducta =
  'acosoSexual' | 'acosoLaboral' | 'discriminacion' | 'violenciaBasadaGenero' | 'otra';

export type ModoIdentificacion = 'anonima' | 'confidencial' | 'identificada';

export type EstadoCaso =
  | 'radicada'
  | 'proteccion'
  | 'traslado'
  | 'pruebas'
  | 'informe'
  | 'decision'
  | 'seguimiento'
  | 'cerrada';

export interface DefinicionConducta {
  readonly id: TipoConducta;
  readonly rotulo: string;
  readonly norma: string;
  readonly conciliable: boolean;
  readonly nota: string;
}

export const CONDUCTAS: readonly DefinicionConducta[] = [
  {
    id: 'acosoSexual',
    rotulo: 'Acoso sexual laboral',
    norma: 'Ley 2365 de 2024 · Código Penal, art. 210A',
    conciliable: false,
    nota: 'No es conciliable. La función conciliatoria del Comité de Convivencia no aplica: proponer un arreglo entre las partes revictimiza. Además es delito, y la persona denunciante conserva intacto su derecho a denunciar penalmente.',
  },
  {
    id: 'violenciaBasadaGenero',
    rotulo: 'Violencia basada en género',
    norma: 'Ley 1257 de 2008 · Ley 2365 de 2024',
    conciliable: false,
    nota: 'No es conciliable. Exige medidas de protección inmediatas y remisión a las rutas externas de atención.',
  },
  {
    id: 'acosoLaboral',
    rotulo: 'Acoso laboral',
    norma: 'Ley 1010 de 2006',
    conciliable: true,
    nota: 'El Comité de Convivencia Laboral sí cumple una función conciliatoria, siempre que la persona afectada lo acepte de forma libre e informada.',
  },
  {
    id: 'discriminacion',
    rotulo: 'Discriminación',
    norma: 'Ley 1482 de 2011 · C. P. art. 13',
    conciliable: true,
    nota: 'Se tramita por el canal interno y puede escalar a la autoridad competente según la conducta.',
  },
  {
    id: 'otra',
    rotulo: 'Otra conducta contraria a la convivencia',
    norma: 'Reglamento Interno de Trabajo',
    conciliable: true,
    nota: 'Se encauza por el mecanismo interno que corresponda según el reglamento.',
  },
] as const;

export function conductaPorId(id: TipoConducta): DefinicionConducta {
  const c = CONDUCTAS.find((x) => x.id === id);
  if (!c) throw new RangeError(`Conducta desconocida: "${id}"`);
  return c;
}

/* ══ Ruta de atención ════════════════════════════════════════════ */

export interface EtapaRuta {
  readonly id: EstadoCaso;
  readonly rotulo: string;
  readonly descripcion: string;
  /** Días hábiles de referencia del protocolo tipo. */
  readonly diasHabiles: number;
  readonly norma: string;
  readonly garantia: string;
}

export const RUTA: readonly EtapaRuta[] = [
  {
    id: 'radicada',
    rotulo: 'Recepción y radicado',
    descripcion: 'Se recibe la denuncia, se asigna radicado y se entrega la clave de consulta.',
    diasHabiles: 1,
    norma: 'Ley 2365 de 2024, art. 6',
    garantia:
      'La recepción no puede condicionarse a que la persona se identifique, ni a que aporte pruebas de entrada. Exigir prueba para recibir es una forma de negar el canal.',
  },
  {
    id: 'proteccion',
    rotulo: 'Medidas de protección inmediatas',
    descripcion: 'Se adoptan medidas para evitar el contacto y el riesgo de represalia.',
    diasHabiles: 1,
    norma: 'Ley 2365 de 2024, art. 7',
    garantia:
      'La protección es inmediata y no depende de que los hechos estén probados. Ninguna medida puede empeorar la situación laboral de quien denuncia: trasladarla a ella, cambiarle el horario o reducirle funciones es una represalia disfrazada de protección.',
  },
  {
    id: 'traslado',
    rotulo: 'Traslado y descargos',
    descripcion: 'Se comunican los hechos a la persona señalada y se recibe su versión.',
    diasHabiles: 5,
    norma: 'C. P. art. 29 · CST art. 115',
    garantia:
      'El debido proceso protege también a la persona señalada. El traslado se hace sin revelar datos que expongan a la persona denunciante más allá de lo necesario para ejercer la defensa.',
  },
  {
    id: 'pruebas',
    rotulo: 'Práctica de pruebas',
    descripcion: 'Se recaudan testimonios, registros y soportes.',
    diasHabiles: 10,
    norma: 'Ley 2365 de 2024 · Resolución 2764 de 2022',
    garantia:
      'No se somete a la persona denunciante a careos ni a repetir su relato sin necesidad. El principio de no revictimización es una regla de procedimiento, no una recomendación.',
  },
  {
    id: 'informe',
    rotulo: 'Informe del comité',
    descripcion: 'El comité consolida hallazgos y formula recomendaciones motivadas.',
    diasHabiles: 10,
    norma: 'Ley 1010 de 2006 · Resolución 652 de 2012',
    garantia:
      'El informe se motiva en lo probado. Tratándose de acoso sexual, el comité no concilia: recomienda.',
  },
  {
    id: 'decision',
    rotulo: 'Decisión del empleador',
    descripcion: 'Se resuelve y se comunica a las partes.',
    diasHabiles: 5,
    norma: 'CST arts. 111 a 115 · Ley 2365 de 2024',
    garantia:
      'La decisión se comunica a ambas partes. A la persona denunciante se le informa el resultado: cerrar el caso sin decirle en qué terminó es incumplir el protocolo.',
  },
  {
    id: 'seguimiento',
    rotulo: 'Seguimiento',
    descripcion: 'Se verifica que no haya represalias ni reiteración de la conducta.',
    diasHabiles: 30,
    norma: 'Ley 2365 de 2024, art. 8',
    garantia:
      'La represalia posterior a la denuncia es una conducta autónoma y sancionable. El seguimiento existe para detectarla.',
  },
  {
    id: 'cerrada',
    rotulo: 'Cierre',
    descripcion: 'El caso se archiva con constancia del resultado y del seguimiento.',
    diasHabiles: 1,
    norma: 'Ley 2365 de 2024',
    garantia:
      'El expediente se conserva con reserva. Es dato sensible: su custodia exige medidas reforzadas bajo la Ley 1581 de 2012.',
  },
] as const;

export function etapaRuta(id: EstadoCaso): EtapaRuta {
  const e = RUTA.find((x) => x.id === id);
  if (!e) throw new RangeError(`Etapa de la ruta desconocida: "${id}"`);
  return e;
}

export function siguienteEtapa(id: EstadoCaso): EstadoCaso | null {
  const i = RUTA.findIndex((x) => x.id === id);
  return i >= 0 && i < RUTA.length - 1 ? RUTA[i + 1]!.id : null;
}

/* ══ Medidas de protección ═══════════════════════════════════════ */

export interface Medida {
  readonly id: string;
  readonly rotulo: string;
  readonly descripcion: string;
  readonly norma: string;
  /** `true` si la medida recae sobre la persona denunciante. */
  readonly recaeSobreDenunciante: boolean;
}

export const MEDIDAS: readonly Medida[] = [
  {
    id: 'separacion',
    rotulo: 'Separación de espacios de trabajo',
    descripcion: 'Se reubica a la persona señalada para evitar el contacto directo.',
    norma: 'Ley 2365 de 2024, art. 7',
    recaeSobreDenunciante: false,
  },
  {
    id: 'suspension-cadena',
    rotulo: 'Suspensión de la relación de subordinación',
    descripcion: 'Se retira a la persona señalada de la línea de mando sobre quien denuncia.',
    norma: 'Ley 2365 de 2024, art. 7',
    recaeSobreDenunciante: false,
  },
  {
    id: 'canales',
    rotulo: 'Restricción de canales de contacto',
    descripcion: 'Se limita la comunicación directa por canales corporativos.',
    norma: 'Ley 2365 de 2024 · política interna',
    recaeSobreDenunciante: false,
  },
  {
    id: 'apoyo-psicologico',
    rotulo: 'Apoyo psicológico',
    descripcion: 'Remisión a la EPS o al programa de bienestar, con consentimiento.',
    norma: 'Ley 2365 de 2024, art. 7 · SG-SST',
    recaeSobreDenunciante: true,
  },
  {
    id: 'acompanamiento',
    rotulo: 'Acompañamiento en el proceso',
    descripcion: 'Se designa una persona de confianza para acompañar las diligencias.',
    norma: 'Resolución 2764 de 2022',
    recaeSobreDenunciante: true,
  },
  {
    id: 'licencia',
    rotulo: 'Licencia remunerada para la persona denunciante',
    descripcion: 'Solo a solicitud expresa de quien denuncia, nunca impuesta.',
    norma: 'Ley 2365 de 2024, art. 7',
    recaeSobreDenunciante: true,
  },
  {
    id: 'no-represalia',
    rotulo: 'Compromiso escrito de no represalia',
    descripcion: 'Advertencia formal sobre las consecuencias de cualquier retaliación.',
    norma: 'Ley 2365 de 2024, art. 8',
    recaeSobreDenunciante: false,
  },
] as const;

/* ══ Caso ════════════════════════════════════════════════════════ */

export interface Caso {
  readonly id: string;
  readonly radicado: string;
  /** Huella de la clave de consulta. La clave en claro no se almacena. */
  readonly huellaClave: string;
  readonly conducta: TipoConducta;
  readonly modo: ModoIdentificacion;
  /** Vacío cuando la denuncia es anónima. */
  readonly denunciante: string;
  readonly vinculo: string;
  readonly relato: string;
  readonly fechaHechos: FechaISO;
  readonly fechaRadicado: FechaISO;
  readonly estado: EstadoCaso;
  readonly medidas: readonly string[];
  readonly bitacora: readonly {
    readonly fecha: FechaISO;
    readonly estado: EstadoCaso;
    readonly nota: string;
  }[];
}

/**
 * Radicado legible, sin información que identifique a nadie.
 * Formato `DEN-AAAA-NNNN`.
 */
export function generarRadicado(anio: number, consecutivo: number): string {
  return `DEN-${anio}-${String(consecutivo).padStart(4, '0')}`;
}

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin I, O, 0 ni 1

/**
 * Clave de consulta de 12 caracteres, agrupada para poder dictarla por
 * teléfono. Es lo único que permite recuperar el caso: no hay cuenta de
 * usuario, y esa es justamente la garantía de anonimato.
 */
export function generarClave(aleatorio: (n: number) => Uint8Array): string {
  const bytes = aleatorio(12);
  const letras = [...bytes].map((b) => ALFABETO[b % ALFABETO.length]!).join('');
  return `${letras.slice(0, 4)}-${letras.slice(4, 8)}-${letras.slice(8, 12)}`;
}

export function normalizarClave(clave: string): string {
  return clave.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/* ══ Plazos de la ruta ═══════════════════════════════════════════ */

export interface HitoRuta {
  readonly etapa: EtapaRuta;
  readonly inicio: FechaISO;
  readonly limite: FechaISO;
  readonly cumplida: boolean;
  readonly esActual: boolean;
}

export function proyectarRuta(
  caso: Caso,
  sumarHabiles: (iso: FechaISO, dias: number) => FechaISO,
): readonly HitoRuta[] {
  const indiceActual = RUTA.findIndex((e) => e.id === caso.estado);
  let cursor = caso.fechaRadicado;
  return RUTA.map((etapa, i) => {
    const limite = sumarHabiles(cursor, etapa.diasHabiles);
    const hito: HitoRuta = {
      etapa,
      inicio: cursor,
      limite,
      cumplida: indiceActual > i,
      esActual: indiceActual === i,
    };
    cursor = limite;
    return hito;
  });
}

/* ══ Revisión del protocolo ══════════════════════════════════════ */

export interface Observacion {
  readonly gravedad: 'grave' | 'aviso';
  readonly mensaje: string;
  readonly norma: string;
}

export function revisarCaso(caso: Caso, hoy: FechaISO): readonly Observacion[] {
  const obs: Observacion[] = [];
  const conducta = conductaPorId(caso.conducta);
  const indice = RUTA.findIndex((e) => e.id === caso.estado);

  if (!conducta.conciliable) {
    obs.push({
      gravedad: 'aviso',
      mensaje: conducta.nota,
      norma: conducta.norma,
    });
  }

  if (indice >= 1 && caso.medidas.length === 0) {
    obs.push({
      gravedad: 'grave',
      mensaje:
        'El caso avanzó sin registrar medidas de protección. La ley exige que sean inmediatas y que no dependan de que los hechos estén probados.',
      norma: 'Ley 2365 de 2024, art. 7',
    });
  }

  const sobreDenunciante = caso.medidas
    .map((id) => MEDIDAS.find((m) => m.id === id))
    .filter((m): m is Medida => Boolean(m) && m!.recaeSobreDenunciante && m!.id !== 'licencia');
  const sobreSenalado = caso.medidas
    .map((id) => MEDIDAS.find((m) => m.id === id))
    .filter((m): m is Medida => Boolean(m) && !m!.recaeSobreDenunciante);

  if (sobreDenunciante.length > 0 && sobreSenalado.length === 0) {
    obs.push({
      gravedad: 'grave',
      mensaje:
        'Todas las medidas registradas recaen sobre la persona denunciante y ninguna sobre la señalada. Proteger moviendo a quien denuncia es una represalia disfrazada de protección.',
      norma: 'Ley 2365 de 2024, arts. 7 y 8',
    });
  }

  if (caso.modo === 'anonima' && caso.denunciante.trim() !== '') {
    obs.push({
      gravedad: 'grave',
      mensaje:
        'El caso está marcado como anónimo pero contiene datos de identificación. La reserva prometida debe cumplirse en el propio registro.',
      norma: 'Ley 1581 de 2012 · Ley 2365 de 2024',
    });
  }

  if (caso.relato.trim().length < 30) {
    obs.push({
      gravedad: 'aviso',
      mensaje:
        'El relato es muy breve. Ampliarlo ayuda a la investigación, pero no se puede exigir como condición para recibir la denuncia.',
      norma: 'Ley 2365 de 2024, art. 6',
    });
  }

  if (caso.estado !== 'cerrada' && caso.fechaRadicado < hoy) {
    const hito = proyectarRuta(caso, (iso, dias) => {
      // Proyección simple para la advertencia: días calendario como cota
      // inferior. El cálculo exacto en días hábiles lo hace la interfaz.
      const f = new Date(`${iso}T00:00:00`);
      f.setDate(f.getDate() + dias);
      return f.toISOString().slice(0, 10);
    }).find((h) => h.esActual);
    if (hito && hito.limite < hoy) {
      obs.push({
        gravedad: 'aviso',
        mensaje: `La etapa «${hito.etapa.rotulo}» superó su plazo de referencia. Revise el estado del caso.`,
        norma: hito.etapa.norma,
      });
    }
  }

  return obs;
}
