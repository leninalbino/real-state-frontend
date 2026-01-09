import { apiFetch } from '../../../shared/api/client';
import type { User } from '../../auth/AuthContext';
import type { Property } from '../../properties/types';

export interface AgentProfile {
  id: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  verified: boolean;
  user: User;
  _count: {
    properties: number;
  };
}

export interface AgentDetail extends AgentProfile {
  properties: Property[];
}

export const getAgents = (): Promise<AgentProfile[]> =>
  apiFetch<AgentProfile[]>('/api/admin/agents', { auth: true });

export const getAgentById = (id: string): Promise<AgentDetail> =>
  apiFetch<AgentDetail>(`/api/admin/agents/${id}`, { auth: true });
