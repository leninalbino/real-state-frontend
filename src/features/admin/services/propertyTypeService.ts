import { apiFetch } from '../../../shared/api/client';

export interface PropertyType {
  id: string;
  name: string;
  key: string;
}

export const getPropertyTypes = () =>
  apiFetch<PropertyType[]>('/api/property-types');

export const createPropertyType = (data: { name: string; key: string }) =>
  apiFetch<PropertyType>('/api/property-types', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  });

export const updatePropertyType = (id: string, data: { name?: string; key?: string }) =>
  apiFetch<PropertyType>(`/api/property-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    auth: true,
  });

export const deletePropertyType = (id: string) =>
  apiFetch(`/api/property-types/${id}`, {
    method: 'DELETE',
    auth: true,
  });
