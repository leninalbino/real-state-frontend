import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdForm } from '../../properties/components/AdForm';
import {
  getPropertyById,
  updateProperty,
  type CreatePropertyInput,
} from '../../properties/services/propertyService';
import type { Property } from '../../properties/types';

const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmit = async (data: Partial<CreatePropertyInput>) => {
    if (!id) return;
    await updateProperty(id, data);
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <AdForm
        onSubmit={handleSubmit}
        initialData={property}
        isEditing={true}
        onCancel={() => navigate('/admin')}
      />
    </div>
  );
};

export default EditPropertyPage;
