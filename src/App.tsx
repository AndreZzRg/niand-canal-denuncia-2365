import { useState, type JSX } from 'react';

import { Portada } from './brand/Portada';
import { APP, MODULOS, Shell, type ModuloId, type Vista } from './brand/Shell';
import { PanelBandeja } from './features/PanelBandeja';
import { PanelConsultar } from './features/PanelConsultar';
import { PanelMedidas } from './features/PanelMedidas';
import { PanelRadicar } from './features/PanelRadicar';
import { PanelRuta } from './features/PanelRuta';

const PANELES: Record<ModuloId, () => JSX.Element> = {
  'radicar-denuncia': PanelRadicar,
  'consultar-radicado': PanelConsultar,
  'bandeja-del-comite': PanelBandeja,
  'ruta-de-atencion-y-plazos': PanelRuta,
  'medidas-de-proteccion': PanelMedidas,
};

export default function App() {
  // Se abre en la portada: quien llega ve primero de qué se compone la
  // herramienta, en vez de caer dentro del primer módulo sin contexto.
  const [vista, setVista] = useState<Vista>('portada');
  const Panel = vista === 'portada' ? null : PANELES[vista];

  return (
    <Shell vista={vista} onVista={setVista}>
      {Panel ? (
        <Panel />
      ) : (
        <Portada
          titulo={APP.nombre}
          descripcion={APP.resumen}
          modulos={MODULOS}
          onAbrir={(id) => setVista(id as ModuloId)}
        />
      )}
    </Shell>
  );
}
