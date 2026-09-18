/**
 * Módulo «Ruta de atención y plazos»: la ruta completa, con la garantía que
 * protege cada etapa y su plazo de referencia.
 */
import { Info } from 'lucide-react';

import { Dato, Insignia, Llamado, Tabla, Tarjeta, Td, Th } from '../brand/ui';
import { CONDUCTAS, RUTA, proyectarRuta } from '../domain/canal';
import { estadoPlazo, sumarHabiles } from '../lib/fechas';
import { fechaLarga, plural } from '../lib/formato';
import { useCaso, useEstado } from '../store';

export function PanelRuta() {
  const { hoy, abierto } = useEstado();
  const caso = useCaso(abierto);
  const total = RUTA.reduce((s, e) => s + e.diasHabiles, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Dato rotulo="Etapas de la ruta" valor={RUTA.length} tono="marca" />
        <Dato
          rotulo="Duración de referencia"
          valor={plural(total, 'día hábil', 'días hábiles')}
          detalle="Del radicado al cierre"
        />
        <Dato
          rotulo="Protección inmediata"
          valor="1 día hábil"
          tono="riesgo"
          detalle="Ley 2365 de 2024, art. 7"
        />
      </div>

      <Llamado
        tono="alerta"
        titulo="Qué fija la ley y qué fija el protocolo"
        icono={<Info size={18} />}
      >
        La Ley 2365 de 2024 exige que la protección sea <strong>inmediata</strong> y que exista una
        ruta de atención, pero deja a cada protocolo la fijación de los plazos internos. Los días
        hábiles que aparecen abajo son <strong>plazos de referencia del protocolo tipo</strong>, no
        términos legales. Ajústelos al protocolo adoptado por la empresa.
      </Llamado>

      {caso && (
        <Tarjeta
          titulo={`Proyección del caso ${caso.radicado}`}
          descripcion={`Desde el radicado del ${fechaLarga(caso.fechaRadicado)}`}
        >
          <Tabla>
            <thead>
              <tr>
                <Th>Etapa</Th>
                <Th>Estado</Th>
                <Th>Límite</Th>
              </tr>
            </thead>
            <tbody>
              {proyectarRuta(caso, sumarHabiles).map((h) => {
                const estado = estadoPlazo(h.limite, hoy);
                return (
                  <tr key={h.etapa.id}>
                    <Td className={h.esActual ? 'font-semibold' : undefined}>{h.etapa.rotulo}</Td>
                    <Td>
                      <Insignia
                        tono={
                          h.cumplida
                            ? 'ok'
                            : h.esActual
                              ? estado === 'vencido'
                                ? 'riesgo'
                                : 'marca'
                              : 'neutro'
                        }
                      >
                        {h.cumplida ? 'cumplida' : h.esActual ? 'en curso' : 'pendiente'}
                      </Insignia>
                    </Td>
                    <Td className="text-sm">{fechaLarga(h.limite)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Tabla>
        </Tarjeta>
      )}

      <Tarjeta titulo="La ruta, etapa por etapa">
        <ol className="space-y-4">
          {RUTA.map((e, i) => (
            <li key={e.id} className="rounded-xl border border-borde bg-superficie-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-marca font-mono text-xs font-semibold text-marca-contraste">
                  {i + 1}
                </span>
                <h3 className="font-display text-sm font-semibold">{e.rotulo}</h3>
                <Insignia tono="info">
                  {plural(e.diasHabiles, 'día hábil', 'días hábiles')}
                </Insignia>
              </div>
              <p className="mt-2 text-sm text-texto-2">{e.descripcion}</p>
              <p className="mt-2 border-l-2 border-marca/40 pl-3 text-sm text-texto-2">
                {e.garantia}
              </p>
              <p className="eyebrow mt-2">{e.norma}</p>
            </li>
          ))}
        </ol>
      </Tarjeta>

      <Tarjeta
        titulo="Qué conductas admiten conciliación"
        descripcion="La distinción no es de estilo: proponer conciliación donde no procede revictimiza."
      >
        <Tabla>
          <thead>
            <tr>
              <Th>Conducta</Th>
              <Th>¿Conciliable?</Th>
              <Th>Norma</Th>
            </tr>
          </thead>
          <tbody>
            {CONDUCTAS.map((c) => (
              <tr key={c.id}>
                <Td>
                  <span className="font-medium">{c.rotulo}</span>
                  <span className="block text-xs text-texto-2">{c.nota}</span>
                </Td>
                <Td>
                  <Insignia tono={c.conciliable ? 'ok' : 'riesgo'}>
                    {c.conciliable ? 'Sí' : 'No'}
                  </Insignia>
                </Td>
                <Td className="text-xs text-texto-2">{c.norma}</Td>
              </tr>
            ))}
          </tbody>
        </Tabla>
      </Tarjeta>
    </div>
  );
}
