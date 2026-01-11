import { useMemo } from 'react';
import rawLocationData from '../../../shared/data/locationv2.json';
import type { PickerNode } from '../../../shared/ui/MultiColumnPicker/types';

interface RawSubBarrio {
  barrio: string;
  sub_barrios: string[];
}

interface RawMunicipio {
  nombre: string;
  sectores: RawSubBarrio[];
}

interface RawProvincia {
  provincia: string;
  municipios: RawMunicipio[];
}

// Helper function to generate a slug-like ID
const toId = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '-');
};

const transformData = (data: RawProvincia[]): PickerNode[] => {
  return data.map((provincia: RawProvincia) => {
    const provinciaId = toId(provincia.provincia);
    return {
      id: provinciaId,
      label: provincia.provincia,
      children: provincia.municipios.map((municipio: RawMunicipio) => {
        const municipioId = `${provinciaId}_${toId(municipio.nombre)}`;
        return {
          id: municipioId,
          label: municipio.nombre,
          children: municipio.sectores.map((sector: RawSubBarrio) => {
            const sectorId = `${municipioId}_${toId(sector.barrio)}`;
            return {
              id: sectorId,
              label: sector.barrio,
              children: sector.sub_barrios.length > 0 
                ? sector.sub_barrios.map(subBarrio => {
                    const subBarrioId = `${sectorId}_${toId(subBarrio)}`;
                    return {
                      id: subBarrioId,
                      label: subBarrio,
                    };
                  })
                : undefined, // No children if sub_barrios is empty
            };
          }),
        };
      }),
    };
  });
};

export const useLocationData = () => {
  const locationData = useMemo(() => transformData(rawLocationData as RawProvincia[]), []);
  return { locationData };
};