export type ListingType = 'SALE' | 'RENT';
export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type Property = {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  listingType: ListingType;
  moderationStatus: ModerationStatus;
  description: string;
  images: string[];
  amenities: string[];
  agent?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: string;
  } | null;
};
