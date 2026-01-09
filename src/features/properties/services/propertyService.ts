// Archivo: src/features/properties/services/propertyService.ts

import type { Property, ListingType } from '../types';
import { apiFetch } from '../../../shared/api/client';

// --- Tipos de Filtros para Búsqueda ---
interface PropertyFilters {
  listingType?: ListingType[];
  type?: string[];
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaMin?: number;
  areaMax?: number;
  amenities?: string[];
  page?: number;
  pageSize?: number;
}

export interface HeroSlide {
  id: string;
  titulo: string;
  img: string;
  isLocal: boolean;
}

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/**
 * Simula una llamada a la API para obtener una lista de propiedades.
 * En el futuro, esta función hará una petición HTTP real.
 *
 * --- API Request ---
 * Method: GET
 * Endpoint: /api/properties
 * Query Params:
 *  - listingType: string (ej: "SALE,RENT")
 *  - type: string (ej: "Apartamento,Casa")
 *  - minPrice: number
 *  - maxPrice: number
 *
 * --- API Response (Success) ---
 * Status: 200 OK
 * Body: Property[]
 *
 * @param filters - Objeto con los filtros a aplicar.
 * @returns Una promesa que resuelve a un array de propiedades.
 */
export const getProperties = (
  filters: PropertyFilters
): Promise<PaginatedResponse<Property>> => {
  const params = new URLSearchParams();
  if (filters.listingType?.length) {
    params.set('listingType', filters.listingType.join(','));
  }
  if (filters.type?.length) {
    params.set('type', filters.type.join(','));
  }
  if (typeof filters.minPrice === 'number') {
    params.set('minPrice', String(filters.minPrice));
  }
  if (typeof filters.maxPrice === 'number') {
    params.set('maxPrice', String(filters.maxPrice));
  }
  if (filters.location) {
    params.set('location', filters.location);
  }
  if (typeof filters.bedrooms === 'number') {
    params.set('bedrooms', String(filters.bedrooms));
  }
  if (typeof filters.bathrooms === 'number') {
    params.set('bathrooms', String(filters.bathrooms));
  }
  if (typeof filters.areaMin === 'number') {
    params.set('areaMin', String(filters.areaMin));
  }
  if (typeof filters.areaMax === 'number') {
    params.set('areaMax', String(filters.areaMax));
  }
  if (filters.amenities?.length) {
    params.set('amenities', filters.amenities.join(','));
  }
  if (typeof filters.page === 'number') {
    params.set('page', String(filters.page));
  }
  if (typeof filters.pageSize === 'number') {
    params.set('pageSize', String(filters.pageSize));
  }
  return apiFetch<PaginatedResponse<Property>>(`/api/properties?${params.toString()}`);
};

export const getAllProperties = (
  filters: PropertyFilters
): Promise<PaginatedResponse<Property>> => {
  const params = new URLSearchParams();
  if (filters.listingType?.length) {
    params.set('listingType', filters.listingType.join(','));
  }
  if (filters.type?.length) {
    params.set('type', filters.type.join(','));
  }
  if (typeof filters.minPrice === 'number') {
    params.set('minPrice', String(filters.minPrice));
  }
  if (typeof filters.maxPrice === 'number') {
    params.set('maxPrice', String(filters.maxPrice));
  }
  if (filters.location) {
    params.set('location', filters.location);
  }
  if (typeof filters.bedrooms === 'number') {
    params.set('bedrooms', String(filters.bedrooms));
  }
  if (typeof filters.bathrooms === 'number') {
    params.set('bathrooms', String(filters.bathrooms));
  }
  if (typeof filters.areaMin === 'number') {
    params.set('areaMin', String(filters.areaMin));
  }
  if (typeof filters.areaMax === 'number') {
    params.set('areaMax', String(filters.areaMax));
  }
  if (filters.amenities?.length) {
    params.set('amenities', filters.amenities.join(','));
  }
  if (typeof filters.page === 'number') {
    params.set('page', String(filters.page));
  }
  if (typeof filters.pageSize === 'number') {
    params.set('pageSize', String(filters.pageSize));
  }
  return apiFetch<PaginatedResponse<Property>>(`/api/admin/properties?${params.toString()}`, {
    auth: true,
  });
};

/**
 * Simula una llamada a la API para obtener una única propiedad por su ID.
 *
 * --- API Request ---
 * Method: GET
 * Endpoint: /api/properties/{id}
 *
 * --- API Response (Success) ---
 * Status: 200 OK
 * Body: Property
 *
 * --- API Response (Not Found) ---
 * Status: 404 Not Found
 *
 * @param id - El ID de la propiedad a buscar.
 * @returns Una promesa que resuelve a la propiedad encontrada o undefined si no existe.
 */
export const getPropertyById = (id: string): Promise<Property> =>
  apiFetch<Property>(`/api/properties/${id}`);

/**
 * Simula una llamada a la API para obtener los slides de la sección Hero.
 *
 * --- API Request ---
 * Method: GET
 * Endpoint: /api/hero-slides
 *
 * --- API Response (Success) ---
 * Status: 200 OK
 * Body: HeroSlide[]
 *
 * @returns Una promesa que resuelve a un array de slides.
 */
export const getHeroSlides = (): Promise<HeroSlide[]> =>
  apiFetch<HeroSlide[]>('/api/hero-slides');

export type CreatePropertyInput = {
  title: string;
  price: number;
  currency: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  listingType: ListingType;
  description: string;
  images?: string[];
  amenities?: string[];
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAvatar?: string;
};

export const createProperty = (payload: CreatePropertyInput) =>
  apiFetch<Property>('/api/properties', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: true,
  });

export const updateProperty = (id: string, payload: Partial<CreatePropertyInput>) =>
  apiFetch<Property>(`/api/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    auth: true,
  });

export const deleteProperty = (id: string) =>
  apiFetch(`/api/properties/${id}`, {
    method: 'DELETE',
    auth: true,
  });

export const approveProperty = (id: string) =>
  apiFetch<Property>(`/api/properties/${id}/approve`, {
    method: 'PUT',
    auth: true,
  });

export const rejectProperty = (id: string) =>
  apiFetch<Property>(`/api/properties/${id}/reject`, {
    method: 'PUT',
    auth: true,
  });
