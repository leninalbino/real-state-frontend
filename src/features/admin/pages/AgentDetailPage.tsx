import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAgentById } from '../services/adminService';
import type { AgentDetail } from '../services/adminService';

const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) return;
      try {
        const data = await getAgentById(id);
        setAgent(data);
      } catch (error) {
        console.error('Error fetching agent details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!agent) {
    return <div>Agent not found</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">Agent Details</h2>
          <p className="text-gray-600">
            {agent.displayName || agent.user.fullName} - {agent.contactEmail || agent.user.email}
          </p>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold leading-tight">Properties</h3>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agent.properties.map((property) => (
                    <tr key={property.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{property.title}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">${property.price.toLocaleString()}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                            property.moderationStatus === 'APPROVED'
                              ? 'text-green-900'
                              : property.moderationStatus === 'PENDING'
                              ? 'text-yellow-900'
                              : 'text-red-900'
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`absolute inset-0 ${
                              property.moderationStatus === 'APPROVED'
                                ? 'bg-green-200'
                                : property.moderationStatus === 'PENDING'
                                ? 'bg-yellow-200'
                                : 'bg-red-200'
                            } opacity-50 rounded-full`}
                          ></span>
                          <span className="relative">{property.moderationStatus}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
