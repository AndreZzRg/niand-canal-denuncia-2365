/**
 * Módulo «Medidas de protección»: catálogo y registro por caso.
 *
 * El criterio que ordena este módulo: la carga de la protección recae sobre
 * la persona señalada, no sobre quien denuncia.
 */
import { ShieldAlert, ShieldCheck } from 'lucide-react';

import { Insignia, Llamado, Tarjeta, Vacio, cx } from '../brand/ui';
import { MEDIDAS, revisarCaso } from '../domain/canal';
import { useCaso, useEstado } from '../store';

export function PanelMedidas() {
  const { abierto, hoy, alternarMedida } = useEstado();
  const caso = useCaso(abierto);

  const sobreSenalado = MEDIDAS.filter((m) => !m.recaeSobreDenunciante);
  const sobreDenunciante = MEDIDAS.filter((m) => m.recaeSobreDenunciante);

  return (
    <div className="space-y-6">
      <Llamado
        tono="alerta"
        titulo="El criterio que ordena este módulo"
        icono={<ShieldAlert size={18} />}
      >
        La protección recae sobre la <strong>persona señalada</strong>. Trasladar a quien denuncia,
        cambiarle el horario, reducirle funciones o «apartarla mientras se investiga» es una
        represalia disfrazada de protección, y la Ley 2365 de 2024 la prohíbe de forma expresa en
        sus artículos 7 y 8. Las medidas que recaen sobre quien denuncia solo proceden{' '}
        <strong>a su solicitud</strong>.
      </Llamado>

      {!caso ? (
        <Vacio titulo="Seleccione un caso">
          Abra un caso en la <strong>bandeja del comité</strong> para registrar sus medidas. Abajo
          puede consultar el catálogo completo.
        </Vacio>
      ) : (
        <>
          {revisarCaso(caso, hoy)
            .filter((o) => o.gravedad === 'grave')
            .map((o) => (
              <Llamado key={o.mensaje} tono="riesgo" icono={<ShieldAlert size={18} />}>
                <p>{o.mensaje}</p>
                <p className="eyebrow mt-1">{o.norma}</p>
              </Llamado>
            ))}

          {caso.medidas.length > 0 && (
            <Llamado tono="ok" icono={<ShieldCheck size={18} />}>
              {caso.medidas.length === 1
                ? 'Hay una medida registrada'
                : `Hay ${caso.medidas.length} medidas registradas`}{' '}
              en el caso {caso.radicado}. Cada una debe constar por escrito y comunicarse a quien
              corresponda.
            </Llamado>
          )}
        </>
      )}

      {(
        [
          ['Sobre la persona señalada', sobreSenalado, 'marca'],
          ['Sobre la persona denunciante — solo a su solicitud', sobreDenunciante, 'alerta'],
        ] as const
      ).map(([titulo, lista, tono]) => (
        <Tarjeta key={titulo} titulo={titulo}>
          <div className="space-y-2">
            {lista.map((m) => {
              const activa = caso?.medidas.includes(m.id) ?? false;
              return (
                <label
                  key={m.id}
                  className={cx(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
                    activa
                      ? 'border-marca bg-indigo/8'
                      : 'border-borde bg-superficie-3 hover:border-borde-fuerte',
                    !caso && 'cursor-not-allowed opacity-60',
                  )}
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 accent-[var(--marca)]"
                    checked={activa}
                    disabled={!caso}
                    onChange={() => caso && alternarMedida(caso.id, m.id)}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{m.rotulo}</span>
                      <Insignia tono={tono}>
                        {m.recaeSobreDenunciante ? 'denunciante' : 'persona señalada'}
                      </Insignia>
                    </span>
                    <span className="mt-1 block text-sm text-texto-2">{m.descripcion}</span>
                    <span className="eyebrow mt-1 block">{m.norma}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </Tarjeta>
      ))}
    </div>
  );
}
