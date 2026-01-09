import { useNavigate } from "react-router-dom";
import { AdForm } from "../components/AdForm";
import { createProperty } from "../services/propertyService";

const PublishPropertyPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await createProperty(data);
  };

  return (
    <div className="bg-gray-50 pt-16">
      <div className="mx-auto">
        <AdForm onCancel={() => navigate(-1)} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default PublishPropertyPage;
