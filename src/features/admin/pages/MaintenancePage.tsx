import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  const navigate = useNavigate();

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
          <h2 className="text-2xl font-semibold leading-tight">Maintenance</h2>
        </div>
        <div className="my-2 flex sm:flex-row flex-col">
          <div className="block relative">
            <Link
              to="/admin/maintenance/property-types"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Manage Property Types
            </Link>
          </div>
          <div className="block relative ml-4">
            <Link
              to="/admin/maintenance/characteristics"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Manage Characteristics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
