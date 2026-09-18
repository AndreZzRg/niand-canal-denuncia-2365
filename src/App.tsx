import { useState, type JSX } from 'react';

import { Shell, type ModuloId } from './brand/Shell';
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
  const [modulo, setModulo] = useState<ModuloId>('radicar-denuncia');
  const Panel = PANELES[modulo];

  return (
    <Shell moduloActivo={modulo} onModulo={setModulo}>
      <Panel />
    </Shell>
  );
}
