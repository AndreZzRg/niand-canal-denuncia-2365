/**
 * Estado del canal de denuncias.
 *
 * Dos advertencias que la interfaz repite y que aquí se cumplen:
 *
 * 1. Todo queda en el navegador de quien opera la herramienta. Un canal real
 *    exige custodia bajo la Ley 1581 de 2012, porque una denuncia de acoso es
 *    dato sensible.
 * 2. La clave de consulta **no se almacena**: se guarda solo su huella
 *    SHA-256. Si se pierde, no hay forma de recuperarla — y esa es justamente
 *    la garantía que hace posible el anonimato.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { almacenZustand } from './lib/almacen';
import { sha256 } from './lib/huella';
import {
  generarClave,
  generarRadicado,
  normalizarClave,
  siguienteEtapa,
  type Caso,
  type EstadoCaso,
  type ModoIdentificacion,
  type TipoConducta,
} from './domain/canal';

export interface DatosDenuncia {
  conducta: TipoConducta;
  modo: ModoIdentificacion;
  denunciante: string;
  vinculo: string;
  relato: string;
  fechaHechos: string;
}

interface Estado {
  casos: Caso[];
  hoy: string;
  /** Radicado abierto en la bandeja del comité. */
  abierto: string | null;
  /** Caso recuperado por clave en el módulo de consulta. */
  consultado: string | null;
  radicar: (datos: DatosDenuncia) => Promise<{ radicado: string; clave: string }>;
  consultar: (radicado: string, clave: string) => Promise<boolean>;
  abrir: (id: string | null) => void;
  avanzar: (id: string, nota: string) => void;
  fijarEstado: (id: string, estado: EstadoCaso, nota: string) => void;
  alternarMedida: (id: string, medida: string) => void;
  eliminar: (id: string) => void;
  setHoy: (f: string) => void;
  limpiarConsulta: () => void;
}

const aleatorioSeguro = (n: number) => crypto.getRandomValues(new Uint8Array(n));

export const useEstado = create<Estado>()(
  persist(
    (set, get) => ({
      casos: [],
      hoy: '2026-09-17',
      abierto: null,
      consultado: null,

      radicar: async (datos) => {
        const hoy = get().hoy;
        const anio = Number(hoy.slice(0, 4));
        const consecutivo = get().casos.filter((c) => c.radicado.includes(`-${anio}-`)).length + 1;
        const radicado = generarRadicado(anio, consecutivo);
        const clave = generarClave(aleatorioSeguro);

        const caso: Caso = {
          id: crypto.randomUUID(),
          radicado,
          huellaClave: await sha256(`${radicado}:${normalizarClave(clave)}`),
          conducta: datos.conducta,
          modo: datos.modo,
          // En modo anónimo no se guarda el nombre, aunque se haya escrito.
          denunciante: datos.modo === 'anonima' ? '' : datos.denunciante,
          vinculo: datos.vinculo,
          relato: datos.relato,
          fechaHechos: datos.fechaHechos,
          fechaRadicado: hoy,
          estado: 'radicada',
          medidas: [],
          bitacora: [{ fecha: hoy, estado: 'radicada', nota: 'Denuncia recibida por el canal.' }],
        };

        set((s) => ({ casos: [caso, ...s.casos] }));
        return { radicado, clave };
      },

      consultar: async (radicado, clave) => {
        const buscado = radicado.trim().toUpperCase();
        const caso = get().casos.find((c) => c.radicado === buscado);
        if (!caso) {
          set({ consultado: null });
          return false;
        }
        const huella = await sha256(`${caso.radicado}:${normalizarClave(clave)}`);
        const coincide = huella === caso.huellaClave;
        set({ consultado: coincide ? caso.id : null });
        return coincide;
      },

      abrir: (abierto) => set({ abierto }),

      avanzar: (id, nota) =>
        set((s) => ({
          casos: s.casos.map((c) => {
            if (c.id !== id) return c;
            const siguiente = siguienteEtapa(c.estado);
            if (!siguiente) return c;
            return {
              ...c,
              estado: siguiente,
              bitacora: [...c.bitacora, { fecha: s.hoy, estado: siguiente, nota }],
            };
          }),
        })),

      fijarEstado: (id, estado, nota) =>
        set((s) => ({
          casos: s.casos.map((c) =>
            c.id === id
              ? { ...c, estado, bitacora: [...c.bitacora, { fecha: s.hoy, estado, nota }] }
              : c,
          ),
        })),

      alternarMedida: (id, medida) =>
        set((s) => ({
          casos: s.casos.map((c) =>
            c.id === id
              ? {
                  ...c,
                  medidas: c.medidas.includes(medida)
                    ? c.medidas.filter((m) => m !== medida)
                    : [...c.medidas, medida],
                }
              : c,
          ),
        })),

      eliminar: (id) =>
        set((s) => ({
          casos: s.casos.filter((c) => c.id !== id),
          abierto: s.abierto === id ? null : s.abierto,
          consultado: s.consultado === id ? null : s.consultado,
        })),

      setHoy: (hoy) => set({ hoy }),
      limpiarConsulta: () => set({ consultado: null }),
    }),
    {
      name: 'estado',
      version: 1,
      storage: createJSONStorage(() => almacenZustand),
      // `consultado` no se persiste: una sesión de consulta no sobrevive a la
      // recarga, que es lo que debe pasar en un equipo compartido.
      partialize: (s) => ({ casos: s.casos, hoy: s.hoy, abierto: s.abierto }),
    },
  ),
);

export function useCaso(id: string | null): Caso | null {
  return useEstado((s) => s.casos.find((c) => c.id === id) ?? null);
}
