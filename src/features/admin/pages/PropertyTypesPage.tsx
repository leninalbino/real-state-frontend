import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import {
  getPropertyTypes,
  createPropertyType,
  updatePropertyType,
  deletePropertyType,
} from '../services/propertyTypeService';
import type { PropertyType } from '../services/propertyTypeService';

const PropertyTypesPage: React.FC = () => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingType, setEditingType] = useState<PropertyType | null>(null);
  const [formState, setFormState] = useState({ name: '', key: '' });
  const navigate = useNavigate();

  const fetchPropertyTypes = async () => {
    try {
      const response = await getPropertyTypes();
      setPropertyTypes(response);
    } catch (error) {
      console.error('Error fetching property types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingType) {
        await updatePropertyType(editingType.id, formState);
      } else {
        await createPropertyType(formState);
      }
      setFormState({ name: '', key: '' });
      setEditingType(null);
      fetchPropertyTypes();
    } catch (error) {
      console.error('Error saving property type:', error);
    }
  };

  const handleEdit = (type: PropertyType) => {
    setEditingType(type);
    setFormState({ name: type.name, key: type.key });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property type?')) {
      try {
        await deletePropertyType(id);
        fetchPropertyTypes();
      } catch (error) {
        console.error('Error deleting property type:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingType(null);
    setFormState({ name: '', key: '' });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 pt-16">
      <div>
        <div className="flex items-center py-2 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-gray-900 transition-colors mr-2"
          >
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-2xl font-semibold leading-tight">Manage Property Types</h2>
        </div>

        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex items-end space-x-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formState.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                Key
              </label>
              <input
                type="text"
                name="key"
                id="key"
                value={formState.key}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingType ? 'Update' : 'Create'}
            </button>
            {editingType && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {propertyTypes.map((type) => (
                  <tr key={type.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{type.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{type.key}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button onClick={() => handleEdit(type)} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </button>
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

export default PropertyTypesPage;
