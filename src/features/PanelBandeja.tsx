/**
 * Módulo «Bandeja del comité»: gestión de los casos recibidos.
 */
import { useState } from 'react';
import { ArrowRight, ShieldAlert, Trash2 } from 'lucide-react';

import {
  AreaTexto,
  Boton,
  Dato,
  Insignia,
  Llamado,
  Tabla,
  Tarjeta,
  Td,
  Th,
  Vacio,
  cx,
} from '../brand/ui';
import { conductaPorId, etapaRuta, revisarCaso, siguienteEtapa } from '../domain/canal';
import { fechaLarga } from '../lib/formato';
import { useCaso, useEstado } from '../store';

export function PanelBandeja() {
  const { casos, hoy, abierto, abrir, avanzar, eliminar } = useEstado();
  const caso = useCaso(abierto);
  const [nota, setNota] = useState('');

  const abiertos = casos.filter((c) => c.estado !== 'cerrada');
  const conGraves = casos.filter((c) =>
    revisarCaso(c, hoy).some((o) => o.gravedad === 'grave'),
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Dato rotulo="Casos recibidos" valor={casos.length} />
        <Dato rotulo="En trámite" valor={abiertos.length} tono="marca" />
        <Dato
          rotulo="Con observación grave"
          valor={conGraves}
          tono={conGraves > 0 ? 'riesgo' : 'ok'}
        />
        <Dato
          rotulo="No conciliables"
          valor={casos.filter((c) => !conductaPorId(c.conducta).conciliable).length}
          detalle="Acoso sexual y VBG"
        />
      </div>

      {casos.length === 0 ? (
        <Vacio titulo="La bandeja está vacía">
          Los casos radicados en el canal aparecen aquí. Recuerde que el contenido es dato sensible:
          quien opere esta bandeja debe estar designado formalmente.
        </Vacio>
      ) : (
        <Tarjeta titulo="Casos" descripcion="Ordenados del más reciente al más antiguo.">
          <Tabla>
            <thead>
              <tr>
                <Th>Radicado</Th>
                <Th>Conducta</Th>
                <Th>Etapa</Th>
                <Th>Radicado el</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {casos.map((c) => {
                const graves = revisarCaso(c, hoy).filter((o) => o.gravedad === 'grave').length;
                return (
                  <tr key={c.id} className={cx(c.id === abierto && 'bg-indigo/6')}>
                    <Td>
                      <button
                        type="button"
                        onClick={() => abrir(c.id === abierto ? null : c.id)}
                        className="font-mono text-sm font-medium text-marca hover:underline"
                      >
                        {c.radicado}
                      </button>
                      <span className="eyebrow block">{c.modo}</span>
                    </Td>
                    <Td className="text-sm">{conductaPorId(c.conducta).rotulo}</Td>
                    <Td>
                      <Insignia tono={c.estado === 'cerrada' ? 'neutro' : 'marca'}>
                        {etapaRuta(c.estado).rotulo}
                      </Insignia>
                    </Td>
                    <Td className="text-xs text-texto-2">{fechaLarga(c.fechaRadicado)}</Td>
                    <Td>
                      {graves > 0 && (
                        <Insignia tono="riesgo">
                          {graves} {graves === 1 ? 'alerta' : 'alertas'}
                        </Insignia>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Tabla>
        </Tarjeta>
      )}

      {caso && (
        <Tarjeta
          titulo={`Caso ${caso.radicado}`}
          descripcion={`${conductaPorId(caso.conducta).rotulo} · hechos del ${fechaLarga(caso.fechaHechos)}`}
          acciones={
            <Boton variante="fantasma" tamano="sm" onClick={() => eliminar(caso.id)}>
              <Trash2 size={14} />
            </Boton>
          }
        >
          <div className="space-y-5">
            <div>
              <h3 className="eyebrow mb-1">Relato</h3>
              <p className="rounded-xl border border-borde bg-superficie-3 p-4 text-sm whitespace-pre-wrap">
                {caso.relato}
              </p>
            </div>

            {caso.modo !== 'anonima' && caso.denunciante && (
              <p className="text-sm text-texto-2">
                <strong>Denunciante:</strong> {caso.denunciante}
                {caso.vinculo ? ` — ${caso.vinculo}` : ''}
              </p>
            )}

            {revisarCaso(caso, hoy).map((o) => (
              <Llamado
                key={o.mensaje}
                tono={o.gravedad === 'grave' ? 'riesgo' : 'alerta'}
                icono={<ShieldAlert size={18} />}
              >
                <p>{o.mensaje}</p>
                <p className="eyebrow mt-1">{o.norma}</p>
              </Llamado>
            ))}

            <div className="border-t border-borde pt-4">
              <h3 className="mb-2 font-display text-sm font-semibold">Avanzar la ruta</h3>
              <AreaTexto
                rows={3}
                value={nota}
                placeholder="Qué se hizo en esta etapa. Queda en la bitácora que ve la persona denunciante."
                onChange={(e) => setNota(e.target.value)}
                aria-label="Nota de la actuación"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Boton
                  disabled={!siguienteEtapa(caso.estado) || nota.trim().length < 5}
                  onClick={() => {
                    avanzar(caso.id, nota.trim());
                    setNota('');
                  }}
                >
                  Pasar a{' '}
                  {siguienteEtapa(caso.estado)
                    ? etapaRuta(siguienteEtapa(caso.estado)!).rotulo
                    : 'etapa final'}{' '}
                  <ArrowRight size={14} />
                </Boton>
                <span className="text-xs text-texto-3">
                  Cada avance queda registrado con fecha y visible para quien consulte el radicado.
                </span>
              </div>
            </div>

            <div>
              <h3 className="eyebrow mb-2">Bitácora</h3>
              <ul className="space-y-1.5 text-sm text-texto-2">
                {caso.bitacora.map((b, i) => (
                  <li key={`${b.fecha}-${i}`}>
                    <span className="font-mono text-xs text-texto-3">{b.fecha}</span> —{' '}
                    <strong>{etapaRuta(b.estado).rotulo}:</strong> {b.nota}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Tarjeta>
      )}
    </div>
  );
}
