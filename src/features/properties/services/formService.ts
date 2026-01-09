// Archivo: src/features/properties/services/formService.ts

export interface PropertyType {
  id: string;
  name: string;
}

export interface CharacteristicOption {
  label: string;
  value: string;
}

export interface PropertyCharacteristic {
  id: string;
  label: string;
  type: 'select' | 'number_range' | 'boolean';
  options?: CharacteristicOption[];
}

import { apiFetch } from '../../../shared/api/client';

export const getPropertyTypes = (): Promise<PropertyType[]> =>
  apiFetch<PropertyType[]>('/api/filters/property-types');

export const getPropertyCharacteristics = (): Promise<PropertyCharacteristic[]> =>
  apiFetch<PropertyCharacteristic[]>('/api/filters/property-characteristics');
