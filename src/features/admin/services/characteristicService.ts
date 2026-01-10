import { apiFetch } from '../../../shared/api/client';

export interface CharacteristicOption {
  id: string;
  label: string;
  value: string;
}

export interface PropertyCharacteristic {
  id: string;
  label: string;
  key: string;
  type: string;
  options: CharacteristicOption[];
}

export const getCharacteristics = () =>
  apiFetch<PropertyCharacteristic[]>('/api/property-characteristics');

export const createCharacteristic = (data: {
  label: string;
  key: string;
  type: string;
  options?: { label: string; value: string }[];
}) =>
  apiFetch<PropertyCharacteristic>('/api/property-characteristics', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  });

export const updateCharacteristic = (
  id: string,
  data: {
    label?: string;
    key?: string;
    type?: string;
  }
) =>
  apiFetch<PropertyCharacteristic>(`/api/property-characteristics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    auth: true,
  });

export const deleteCharacteristic = (id: string) =>
  apiFetch(`/api/property-characteristics/${id}`, {
    method: 'DELETE',
    auth: true,
  });

export const addCharacteristicOption = (
  characteristicId: string,
  data: { label: string; value: string }
) =>
  apiFetch<CharacteristicOption>(
    `/api/property-characteristics/${characteristicId}/options`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    }
  );

export const updateCharacteristicOption = (
  id: string,
  data: { label?: string; value?: string }
) =>
  apiFetch<CharacteristicOption>(`/api/property-characteristics/options/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    auth: true,
  });

export const deleteCharacteristicOption = (id: string) =>
  apiFetch(`/api/property-characteristics/options/${id}`, {
    method: 'DELETE',
    auth: true,
  });
