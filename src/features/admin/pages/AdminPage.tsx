import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  deleteProperty,
  getAllProperties,
  approveProperty,
  rejectProperty,
} from '../../properties/services/propertyService';
import type { Property } from '../../properties/types';

const AdminPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const response = await getAllProperties({});
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(id);
        setProperties(properties.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveProperty(id);
      fetchProperties();
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectProperty(id);
      fetchProperties();
    } catch (error) {
      console.error('Error rejecting property:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">Properties</h2>
        </div>
        <div className="my-2 flex sm:flex-row flex-col">
          <div className="block relative">
            <Link to="/anunciar" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create Property
            </Link>
          </div>
          <div className="block relative ml-4">
            <Link to="/admin/agents" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Manage Agents
            </Link>
          </div>
        </div>
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
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
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
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {property.moderationStatus === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(property.id)} className="text-green-600 hover:text-green-900">Approve</button>
                          <button onClick={() => handleReject(property.id)} className="text-red-600 hover:text-red-900 ml-4">Reject</button>
                        </>
                      )}
                      <Link to={`/admin/edit/${property.id}`} className="text-indigo-600 hover:text-indigo-900 ml-4">Edit</Link>
                      <button onClick={() => handleDelete(property.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
