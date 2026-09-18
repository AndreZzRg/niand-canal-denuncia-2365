/**
 * Módulo «Consultar radicado»: recuperación del caso con radicado y clave.
 * No hay cuenta de usuario; la clave es la única credencial, y por eso el
 * anonimato es real.
 */
import { useState } from 'react';
import { KeyRound, Search } from 'lucide-react';

import { Boton, Campo, Entrada, Insignia, Llamado, Tarjeta } from '../brand/ui';
import { conductaPorId, etapaRuta, proyectarRuta, RUTA } from '../domain/canal';
import { estadoPlazo, sumarHabiles } from '../lib/fechas';
import { fechaLarga } from '../lib/formato';
import { useCaso, useEstado } from '../store';

export function PanelConsultar() {
  const { consultar, limpiarConsulta, consultado, hoy } = useEstado();
  const caso = useCaso(consultado);
  const [radicado, setRadicado] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);

  const buscar = async () => {
    setBuscando(true);
    setError(null);
    try {
      const ok = await consultar(radicado, clave);
      if (!ok) {
        setError(
          'No hay ningún caso con ese radicado y esa clave. Revise que los haya copiado completos; la clave distingue entre guiones y espacios pero no entre mayúsculas y minúsculas.',
        );
      }
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Tarjeta titulo="Consultar el estado de una denuncia">
        <div className="space-y-4">
          <Campo etiqueta="Radicado" requerido>
            {(id) => (
              <Entrada
                id={id}
                value={radicado}
                placeholder="DEN-2026-0001"
                className="font-mono"
                onChange={(e) => setRadicado(e.target.value)}
              />
            )}
          </Campo>
          <Campo etiqueta="Clave de consulta" requerido>
            {(id) => (
              <Entrada
                id={id}
                value={clave}
                placeholder="ABCD-EFGH-JKLM"
                className="font-mono tracking-wider"
                onChange={(e) => setClave(e.target.value)}
              />
            )}
          </Campo>

          <Boton disabled={!radicado || !clave || buscando} onClick={() => void buscar()}>
            <Search size={15} /> {buscando ? 'Buscando…' : 'Consultar'}
          </Boton>

          {error && (
            <Llamado tono="riesgo" titulo="No se encontró el caso">
              {error}
            </Llamado>
          )}
        </div>
      </Tarjeta>

      {caso && (
        <Tarjeta
          titulo={`Caso ${caso.radicado}`}
          descripcion={`Radicado el ${fechaLarga(caso.fechaRadicado)}`}
          acciones={
            <Boton variante="fantasma" tamano="sm" onClick={limpiarConsulta}>
              Cerrar
            </Boton>
          }
        >
          <div className="mb-5 flex flex-wrap gap-2">
            <Insignia tono="marca">{etapaRuta(caso.estado).rotulo}</Insignia>
            <Insignia tono="neutro">{conductaPorId(caso.conducta).rotulo}</Insignia>
            <Insignia tono={caso.modo === 'anonima' ? 'ok' : 'info'}>{caso.modo}</Insignia>
          </div>

          <ol className="space-y-2">
            {proyectarRuta(caso, sumarHabiles).map((h) => {
              const vencida = h.esActual && estadoPlazo(h.limite, hoy) === 'vencido';
              return (
                <li
                  key={h.etapa.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-borde bg-superficie-3 px-3 py-2 text-sm"
                >
                  <span
                    className={
                      h.cumplida
                        ? 'text-senal-hondo dark:text-senal-suave'
                        : h.esActual
                          ? 'text-marca'
                          : 'text-texto-3'
                    }
                    aria-hidden
                  >
                    {h.cumplida ? '✓' : h.esActual ? '▸' : '·'}
                  </span>
                  <span className={h.esActual ? 'font-semibold' : undefined}>{h.etapa.rotulo}</span>
                  <span className="ml-auto text-xs text-texto-3">
                    {h.cumplida ? 'cumplida' : fechaLarga(h.limite)}
                  </span>
                  {vencida && <Insignia tono="riesgo">plazo vencido</Insignia>}
                </li>
              );
            })}
          </ol>

          <section className="mt-5">
            <h3 className="mb-2 font-display text-sm font-semibold">Actuaciones comunicadas</h3>
            <ul className="space-y-2 text-sm">
              {caso.bitacora.map((b, i) => (
                <li key={`${b.fecha}-${i}`} className="text-texto-2">
                  <span className="font-mono text-xs text-texto-3">{b.fecha}</span> —{' '}
                  <strong>{etapaRuta(b.estado).rotulo}:</strong> {b.nota}
                </li>
              ))}
            </ul>
          </section>

          <Llamado tono="info" className="mt-5" icono={<KeyRound size={18} />}>
            Esta consulta no deja rastro de quién la hizo. Si el caso avanzó por las {RUTA.length}{' '}
            etapas de la ruta y usted no ha recibido comunicación del resultado, eso mismo es un
            incumplimiento del protocolo.
          </Llamado>
        </Tarjeta>
      )}
    </div>
  );
}
