import { describe, expect, it } from 'vitest';

import { sumarHabiles } from '../lib/fechas';
import {
  CONDUCTAS,
  MEDIDAS,
  RUTA,
  conductaPorId,
  etapaRuta,
  generarClave,
  generarRadicado,
  normalizarClave,
  proyectarRuta,
  revisarCaso,
  siguienteEtapa,
  type Caso,
} from './canal';

const HOY = '2026-09-17';

const caso = (p: Partial<Caso> = {}): Caso => ({
  id: 'c1',
  radicado: 'DEN-2026-0001',
  huellaClave: 'x'.repeat(64),
  conducta: 'acosoSexual',
  modo: 'confidencial',
  denunciante: 'Persona denunciante',
  vinculo: 'Contrato de trabajo',
  relato:
    'Durante las dos últimas semanas recibí mensajes de contenido sexual por el canal corporativo, después de pedir de forma expresa que cesaran.',
  fechaHechos: '2026-09-01',
  fechaRadicado: '2026-09-15',
  estado: 'radicada',
  medidas: [],
  bitacora: [],
  ...p,
});

/** Generador determinista para poder probar la forma de la clave. */
const aleatorioFijo = (n: number) => Uint8Array.from({ length: n }, (_, i) => i * 7);

describe('catálogo de conductas', () => {
  it('declara norma y nota en cada conducta', () => {
    for (const c of CONDUCTAS) {
      expect(c.norma, c.id).toMatch(/Ley|Código|Reglamento|C\. P\./);
      expect(c.nota.length, c.id).toBeGreaterThan(40);
    }
  });

  it('marca el acoso sexual como no conciliable', () => {
    const c = conductaPorId('acosoSexual');
    expect(c.conciliable).toBe(false);
    expect(c.nota).toMatch(/revictimiza/);
    expect(c.norma).toMatch(/210A/);
  });

  it('marca la violencia basada en género como no conciliable', () => {
    expect(conductaPorId('violenciaBasadaGenero').conciliable).toBe(false);
  });

  it('admite la conciliación en acoso laboral de la Ley 1010', () => {
    const c = conductaPorId('acosoLaboral');
    expect(c.conciliable).toBe(true);
    expect(c.nota).toMatch(/libre e informada/);
  });

  it('rechaza una conducta inexistente', () => {
    // @ts-expect-error se comprueba la defensa en tiempo de ejecución
    expect(() => conductaPorId('inventada')).toThrow(RangeError);
  });
});

describe('ruta de atención', () => {
  it('empieza por la recepción y termina en el cierre', () => {
    expect(RUTA[0]!.id).toBe('radicada');
    expect(RUTA.at(-1)!.id).toBe('cerrada');
  });

  it('exige protección inmediata en el segundo paso', () => {
    expect(RUTA[1]!.id).toBe('proteccion');
    expect(RUTA[1]!.diasHabiles).toBe(1);
    expect(RUTA[1]!.garantia).toMatch(/no depende de que los hechos estén probados/);
  });

  it('declara norma y garantía en cada etapa', () => {
    for (const e of RUTA) {
      expect(e.norma, e.id).toMatch(/Ley|Resolución|C\. P\.|CST/);
      expect(e.garantia.length, e.id).toBeGreaterThan(40);
      expect(e.diasHabiles, e.id).toBeGreaterThan(0);
    }
  });

  it('encadena las etapas sin huecos', () => {
    for (let i = 0; i < RUTA.length - 1; i++) {
      expect(siguienteEtapa(RUTA[i]!.id)).toBe(RUTA[i + 1]!.id);
    }
    expect(siguienteEtapa('cerrada')).toBeNull();
  });

  it('rechaza una etapa inexistente', () => {
    // @ts-expect-error se comprueba la defensa en tiempo de ejecución
    expect(() => etapaRuta('inventada')).toThrow(RangeError);
  });
});

describe('proyección de plazos', () => {
  it('encadena los límites en días hábiles desde el radicado', () => {
    const hitos = proyectarRuta(caso(), sumarHabiles);
    expect(hitos).toHaveLength(RUTA.length);
    expect(hitos[0]!.inicio).toBe('2026-09-15');
    for (let i = 1; i < hitos.length; i++) {
      expect(hitos[i]!.inicio).toBe(hitos[i - 1]!.limite);
    }
  });

  it('no fija límites en sábado ni domingo', () => {
    for (const h of proyectarRuta(caso(), sumarHabiles)) {
      const dia = new Date(`${h.limite}T00:00:00`).getDay();
      expect([1, 2, 3, 4, 5], h.etapa.id).toContain(dia);
    }
  });

  it('marca la etapa actual y las cumplidas', () => {
    const hitos = proyectarRuta(caso({ estado: 'pruebas' }), sumarHabiles);
    expect(hitos.find((h) => h.esActual)!.etapa.id).toBe('pruebas');
    expect(hitos.filter((h) => h.cumplida).map((h) => h.etapa.id)).toEqual([
      'radicada',
      'proteccion',
      'traslado',
    ]);
  });
});

describe('radicado y clave de consulta', () => {
  it('produce radicados ordenables y sin datos personales', () => {
    expect(generarRadicado(2026, 1)).toBe('DEN-2026-0001');
    expect(generarRadicado(2026, 1234)).toBe('DEN-2026-1234');
  });

  it('genera una clave agrupada de doce caracteres', () => {
    const clave = generarClave(aleatorioFijo);
    expect(clave).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    expect(normalizarClave(clave)).toHaveLength(12);
  });

  it('excluye los caracteres que se confunden al dictarlos', () => {
    const clave = normalizarClave(generarClave(aleatorioFijo));
    for (const c of 'IO01') expect(clave, `contiene ${c}`).not.toContain(c);
  });

  it('normaliza la clave escrita de cualquier forma', () => {
    expect(normalizarClave('abcd-efgh-jklm')).toBe('ABCDEFGHJKLM');
    expect(normalizarClave('ABCD EFGH JKLM')).toBe('ABCDEFGHJKLM');
  });

  it('produce claves distintas con entropía real', () => {
    const generadas = new Set(
      Array.from({ length: 200 }, () =>
        generarClave((n) => crypto.getRandomValues(new Uint8Array(n))),
      ),
    );
    expect(generadas.size).toBe(200);
  });
});

describe('catálogo de medidas de protección', () => {
  it('distingue sobre quién recae cada medida', () => {
    const sobreSenalado = MEDIDAS.filter((m) => !m.recaeSobreDenunciante);
    const sobreDenunciante = MEDIDAS.filter((m) => m.recaeSobreDenunciante);
    expect(sobreSenalado.length).toBeGreaterThan(0);
    expect(sobreDenunciante.length).toBeGreaterThan(0);
  });

  it('describe la licencia como potestativa de quien denuncia', () => {
    expect(MEDIDAS.find((m) => m.id === 'licencia')!.descripcion).toMatch(/nunca impuesta/);
  });
});

describe('revisión del caso frente al protocolo', () => {
  it('recuerda que el acoso sexual no es conciliable', () => {
    expect(revisarCaso(caso(), HOY).some((o) => o.mensaje.includes('No es conciliable'))).toBe(
      true,
    );
  });

  it('señala el avance sin medidas de protección', () => {
    const o = revisarCaso(caso({ estado: 'traslado' }), HOY);
    expect(o.some((x) => x.gravedad === 'grave' && x.norma.includes('art. 7'))).toBe(true);
  });

  it('no lo señala cuando las medidas están registradas', () => {
    const o = revisarCaso(caso({ estado: 'traslado', medidas: ['separacion'] }), HOY);
    expect(o.some((x) => x.mensaje.includes('sin registrar medidas'))).toBe(false);
  });

  it('detecta la protección que solo recae sobre quien denuncia', () => {
    const o = revisarCaso(caso({ estado: 'proteccion', medidas: ['acompanamiento'] }), HOY);
    expect(o.some((x) => x.mensaje.includes('represalia disfrazada de protección'))).toBe(true);
  });

  it('no la señala si también hay medidas sobre la persona señalada', () => {
    const o = revisarCaso(
      caso({ estado: 'proteccion', medidas: ['acompanamiento', 'separacion'] }),
      HOY,
    );
    expect(o.some((x) => x.mensaje.includes('represalia disfrazada'))).toBe(false);
  });

  it('no trata la licencia solicitada como represalia', () => {
    const o = revisarCaso(caso({ estado: 'proteccion', medidas: ['licencia'] }), HOY);
    expect(o.some((x) => x.mensaje.includes('represalia disfrazada'))).toBe(false);
  });

  it('detecta datos de identificación en una denuncia anónima', () => {
    const o = revisarCaso(caso({ modo: 'anonima', denunciante: 'Nombre visible' }), HOY);
    expect(o.some((x) => x.mensaje.includes('marcado como anónimo'))).toBe(true);
  });

  it('acepta la denuncia anónima sin datos', () => {
    const o = revisarCaso(caso({ modo: 'anonima', denunciante: '' }), HOY);
    expect(o.some((x) => x.mensaje.includes('marcado como anónimo'))).toBe(false);
  });

  it('avisa del relato demasiado breve sin exigirlo como requisito', () => {
    const o = revisarCaso(caso({ relato: 'Pasó algo' }), HOY);
    const aviso = o.find((x) => x.mensaje.includes('muy breve'))!;
    expect(aviso.gravedad).toBe('aviso');
    expect(aviso.mensaje).toMatch(/no se puede exigir como condición/);
  });
});
