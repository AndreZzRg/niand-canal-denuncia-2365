/**
 * Módulo «Radicar denuncia»: formulario de recepción.
 *
 * La recepción no se condiciona a que la persona se identifique ni a que
 * aporte pruebas. Exigirlas para recibir es una forma de cerrar el canal.
 */
import { useState } from 'react';
import { Copy, KeyRound, Send, ShieldCheck } from 'lucide-react';

import {
  AreaTexto,
  Boton,
  Campo,
  Entrada,
  Insignia,
  Llamado,
  Seleccion,
  Tarjeta,
  cx,
} from '../brand/ui';
import { CONDUCTAS, conductaPorId } from '../domain/canal';
import type { ModoIdentificacion, TipoConducta } from '../domain/canal';
import { useEstado, type DatosDenuncia } from '../store';

const MODOS: ReadonlyArray<[ModoIdentificacion, string, string]> = [
  [
    'anonima',
    'Anónima',
    'No se guarda su nombre. La investigación puede ser más difícil, pero la denuncia se recibe igual.',
  ],
  [
    'confidencial',
    'Confidencial',
    'Su nombre queda reservado y solo lo conoce quien atiende el caso.',
  ],
  [
    'identificada',
    'Identificada',
    'Su nombre consta en el expediente y se le informa cada avance.',
  ],
];

export function PanelRadicar() {
  const { hoy, radicar, setHoy } = useEstado();
  const [datos, setDatos] = useState<DatosDenuncia>({
    conducta: 'acosoSexual',
    modo: 'confidencial',
    denunciante: '',
    vinculo: '',
    relato: '',
    fechaHechos: hoy,
  });
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [comprobante, setComprobante] = useState<{ radicado: string; clave: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  const conducta = conductaPorId(datos.conducta);
  const listo = datos.relato.trim().length >= 20 && acepta;

  const enviar = async () => {
    setEnviando(true);
    try {
      setComprobante(await radicar(datos));
      setDatos({ ...datos, denunciante: '', vinculo: '', relato: '' });
      setAcepta(false);
    } finally {
      setEnviando(false);
    }
  };

  if (comprobante) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Tarjeta titulo="Denuncia recibida" descripcion="Guarde estos datos antes de salir.">
          <Llamado tono="riesgo" titulo="Esta clave no se puede recuperar">
            La aplicación guarda únicamente la <strong>huella criptográfica</strong> de su clave, no
            la clave. Nadie —tampoco quien administra el canal— puede volver a mostrársela. Si la
            pierde, no podrá consultar el estado de su caso de forma anónima.
          </Llamado>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-borde bg-superficie-3 px-4 py-3">
              <p className="eyebrow">Radicado</p>
              <p className="cifra font-mono text-2xl font-semibold text-marca">
                {comprobante.radicado}
              </p>
            </div>
            <div className="rounded-xl border-2 border-marca bg-indigo/8 px-4 py-3">
              <p className="eyebrow flex items-center gap-1.5">
                <KeyRound size={12} /> Clave de consulta
              </p>
              <p className="cifra font-mono text-2xl font-semibold tracking-wider">
                {comprobante.clave}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Boton
              onClick={() => {
                void navigator.clipboard
                  .writeText(`Radicado: ${comprobante.radicado}\nClave: ${comprobante.clave}`)
                  .then(() => {
                    setCopiado(true);
                    setTimeout(() => setCopiado(false), 1800);
                  })
                  .catch(() => undefined);
              }}
            >
              <Copy size={15} /> {copiado ? 'Copiado' : 'Copiar radicado y clave'}
            </Boton>
            <Boton variante="secundario" onClick={() => setComprobante(null)}>
              Radicar otra denuncia
            </Boton>
          </div>

          <Llamado tono="info" className="mt-5" icono={<ShieldCheck size={18} />}>
            Lo que sigue: en el término de <strong>un día hábil</strong> deben adoptarse medidas de
            protección, sin esperar a que los hechos estén probados (Ley 2365 de 2024, art. 7). Si
            los hechos constituyen delito, usted conserva intacto su derecho a denunciar ante la
            Fiscalía: la vía interna no lo sustituye ni lo impide.
          </Llamado>
        </Tarjeta>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Llamado tono="marca" titulo="Antes de escribir">
        Usted no necesita identificarse ni aportar pruebas para radicar. Se le entregará un radicado
        y una clave con los que podrá seguir el caso. Los datos de esta denuncia son{' '}
        <strong>datos sensibles</strong> bajo la Ley 1581 de 2012 y se tratan con reserva.
      </Llamado>

      <Tarjeta titulo="Radicar denuncia">
        <div className="space-y-5">
          <Campo etiqueta="¿Qué está ocurriendo?" requerido>
            {(id) => (
              <Seleccion
                id={id}
                value={datos.conducta}
                onChange={(e) => setDatos({ ...datos, conducta: e.target.value as TipoConducta })}
              >
                {CONDUCTAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.rotulo}
                  </option>
                ))}
              </Seleccion>
            )}
          </Campo>

          <Llamado tono={conducta.conciliable ? 'info' : 'alerta'}>
            {conducta.nota} <span className="eyebrow block mt-1">{conducta.norma}</span>
          </Llamado>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">¿Cómo quiere denunciar?</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {MODOS.map(([valor, rotulo, detalle]) => (
                <button
                  key={valor}
                  type="button"
                  aria-pressed={datos.modo === valor}
                  onClick={() => setDatos({ ...datos, modo: valor })}
                  className={cx(
                    'rounded-xl border p-3 text-left transition-colors',
                    datos.modo === valor
                      ? 'border-marca bg-indigo/8'
                      : 'border-borde bg-superficie-3 hover:border-borde-fuerte',
                  )}
                >
                  <span className="block text-sm font-semibold">{rotulo}</span>
                  <span className="mt-1 block text-xs text-texto-2">{detalle}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {datos.modo !== 'anonima' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Su nombre">
                {(id) => (
                  <Entrada
                    id={id}
                    value={datos.denunciante}
                    onChange={(e) => setDatos({ ...datos, denunciante: e.target.value })}
                  />
                )}
              </Campo>
              <Campo
                etiqueta="Vínculo con la empresa"
                ayuda="Trabajador, contratista, practicante…"
              >
                {(id) => (
                  <Entrada
                    id={id}
                    value={datos.vinculo}
                    onChange={(e) => setDatos({ ...datos, vinculo: e.target.value })}
                  />
                )}
              </Campo>
            </div>
          )}

          <Campo etiqueta="Fecha de los hechos o del último hecho">
            {(id) => (
              <Entrada
                id={id}
                type="date"
                value={datos.fechaHechos}
                onChange={(e) => setDatos({ ...datos, fechaHechos: e.target.value })}
              />
            )}
          </Campo>

          <Campo
            etiqueta="Qué ocurrió"
            requerido
            ayuda="Escriba con sus palabras. No tiene que usar términos jurídicos."
            error={
              datos.relato.length > 0 && datos.relato.trim().length < 20
                ? 'Amplíe un poco el relato para que se pueda dar trámite.'
                : null
            }
          >
            {(id) => (
              <AreaTexto
                id={id}
                rows={7}
                value={datos.relato}
                onChange={(e) => setDatos({ ...datos, relato: e.target.value })}
              />
            )}
          </Campo>

          <label className="flex items-start gap-2.5 rounded-xl border border-borde bg-superficie-3 p-4 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-[var(--marca)]"
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
            />
            <span className="text-texto-2">
              Autorizo de forma <strong>expresa, previa e informada</strong> el tratamiento de estos
              datos con la finalidad exclusiva de atender la denuncia, conforme a la Ley 1581 de
              2012. Entiendo que se trata de datos sensibles, que su suministro es facultativo y que
              puedo consultar, actualizar o suprimir mi información en el canal de atención de la
              empresa.
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Boton disabled={!listo || enviando} onClick={() => void enviar()}>
              <Send size={15} /> {enviando ? 'Radicando…' : 'Radicar denuncia'}
            </Boton>
            {!acepta && <Insignia tono="alerta">Falta la autorización de tratamiento</Insignia>}
          </div>
        </div>

        <div className="mt-6 border-t border-borde pt-4">
          <Campo etiqueta="Fecha de operación del canal" ayuda="Se usa para calcular los plazos.">
            {(id) => (
              <Entrada id={id} type="date" value={hoy} onChange={(e) => setHoy(e.target.value)} />
            )}
          </Campo>
        </div>
      </Tarjeta>
    </div>
  );
}
