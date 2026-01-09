import { apiFetch } from '../../../shared/api/client';
import type { Property } from '../../properties/types';
import type { CreatePropertyInput } from '../../properties/services/propertyService';

export const getMyProperties = (): Promise<Property[]> =>
  apiFetch<Property[]>('/api/properties/me/properties', { auth: true });

export const updateMyProperty = (
  id: string,
  payload: Partial<CreatePropertyInput>
): Promise<Property> =>
  apiFetch<Property>(`/api/properties/me/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    auth: true,
  });
